"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";

import { getUser } from "./dashboard.actions";
import { billSchema } from "../validations";

export async function payBill(id: number) {
  const bill = await db.query.bills.findFirst({
    where: eq(schema.bills.id, id),
  });

  if (!bill || bill.isPaid) return;

  // 1. Mark as paid
  await db
    .update(schema.bills)
    .set({ isPaid: true })
    .where(eq(schema.bills.id, id));

  // 2. Find or create "Tagihan" category
  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, "Tagihan"),
  });

  if (!category) {
    const result = await db
      .insert(schema.categories)
      .values({
        name: "Tagihan",
        type: "expense",
        icon: "CreditCard",
        priority: "Kebutuhan",
        color: "#f59e0b",
      })
      .returning();
    category = result[0];
  }

  // 3. Create transaction with bill reference
  await db.insert(schema.transactions).values({
    amount: bill.amount,
    categoryId: category.id,
    type: "expense",
    description: `Bayar Tagihan: ${bill.name}`,
    store: bill.provider || bill.name,
    date: new Date().toLocaleDateString("en-CA"),
    userId: CURRENT_USER_ID,
    billId: bill.id,
  });

  // 4. Update user balance
  const user = await getUser();
  if (user) {
    await db
      .update(schema.users)
      .set({ balance: (user.balance ?? 0) - bill.amount })
      .where(eq(schema.users.id, CURRENT_USER_ID));
  }

  revalidatePath("/dashboard", "layout");
}

export async function addBill(data: any) {
  const validatedData = billSchema.parse(data);
  const formData = validatedData;
  await db.insert(schema.bills).values({
    ...formData,
    userId: CURRENT_USER_ID,
  });
  revalidatePath("/dashboard", "layout");
}

export async function deleteBill(id: number) {
  // 1. Disconnect any transactions from this bill first
  await db
    .update(schema.transactions)
    .set({ billId: null })
    .where(eq(schema.transactions.billId, id));

  // 2. Delete the bill
  await db.delete(schema.bills).where(eq(schema.bills.id, id));

  revalidatePath("/dashboard", "layout");
}

