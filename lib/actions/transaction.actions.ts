"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";

import { getUser } from "./dashboard.actions";

import { transactionSchema } from "../validations";

export async function addTransaction(data: any) {
  const validatedData = transactionSchema.parse(data);
  const formData = validatedData;
  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, formData.categoryName),
  });

  if (!category) {
    const result = await db.insert(schema.categories).values({
      name: formData.categoryName,
      type: formData.type,
      color: formData.type === "expense" ? "#ef4444" : "#10b981",
      priority: "Lainnya",
    }).returning();
    category = result[0];
  }

  await db.insert(schema.transactions).values({
    amount: formData.amount,
    categoryId: category.id,
    type: formData.type,
    description: formData.description || formData.categoryName,
    store: formData.store,
    date: formData.date || new Date().toLocaleDateString("en-CA"),
    userId: CURRENT_USER_ID,
  });

  const user = await getUser();
  if (user) {
    const newBalance =
      formData.type === "income"
        ? (user.balance ?? 0) + formData.amount
        : (user.balance ?? 0) - formData.amount;
    await db.update(schema.users).set({ balance: newBalance }).where(eq(schema.users.id, CURRENT_USER_ID));
  }

  revalidatePath("/dashboard", "layout");
}

export async function updateTransaction(id: number, data: any) {
  const validatedData = transactionSchema.parse(data);
  const formData = validatedData;
  const oldTx = await db.query.transactions.findFirst({
    where: eq(schema.transactions.id, id),
  });
  if (!oldTx) return;

  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, formData.categoryName),
  });

  if (!category) {
    const result = await db.insert(schema.categories).values({
      name: formData.categoryName,
      type: formData.type,
      color: formData.type === "expense" ? "#ef4444" : "#10b981",
      priority: "Lainnya",
    }).returning();
    category = result[0];
  }

  await db.update(schema.transactions).set({
    amount: formData.amount,
    categoryId: category.id,
    type: formData.type,
    description: formData.description || formData.categoryName,
    store: formData.store,
    date: formData.date || oldTx.date,
  }).where(eq(schema.transactions.id, id));

  const user = await getUser();
  if (user) {
    let balance = user.balance ?? 0;
    if (oldTx.type === "income") balance -= oldTx.amount;
    else balance += oldTx.amount;

    if (formData.type === "income") balance += formData.amount;
    else balance -= formData.amount;

    await db.update(schema.users).set({ balance }).where(eq(schema.users.id, CURRENT_USER_ID));
  }

  revalidatePath("/dashboard", "layout");
}

export async function deleteTransaction(id: number) {
  const transaction = await db.query.transactions.findFirst({
    where: eq(schema.transactions.id, id),
  });

  // If already deleted, just return (idempotency)
  if (!transaction) return;

  // 1. Delete transaction
  await db.delete(schema.transactions).where(eq(schema.transactions.id, id));

  // 2. Revert user balance
  const user = await getUser();
  if (user) {
    const newBalance =
      transaction.type === "income"
        ? (user.balance ?? 0) - transaction.amount
        : (user.balance ?? 0) + transaction.amount;

    await db
      .update(schema.users)
      .set({ balance: newBalance })
      .where(eq(schema.users.id, CURRENT_USER_ID));
  }

  // 3. If this was a bill payment, revert bill status to unpaid
  if (transaction.billId) {
    await db
      .update(schema.bills)
      .set({ isPaid: false })
      .where(eq(schema.bills.id, transaction.billId));
  }

  // 4. If this was a savings contribution, revert goal current amount
  if (transaction.goalId) {
    const goal = await db.query.savingsGoals.findFirst({
      where: eq(schema.savingsGoals.id, transaction.goalId),
    });

    if (goal) {
      await db
        .update(schema.savingsGoals)
        .set({
          currentAmount: Math.max(
            0,
            (goal.currentAmount ?? 0) - transaction.amount,
          ),
        })
        .where(eq(schema.savingsGoals.id, transaction.goalId));
    }
  }

  revalidatePath("/dashboard", "layout");
}

export async function addCategory(formData: {
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
  priority?: "Kebutuhan" | "Keinginan" | "Tabungan" | "Lainnya";
}) {
  await db.insert(schema.categories).values({
    ...formData,
  });
  revalidatePath("/dashboard", "layout");
}

export async function deleteCategory(id: number) {
  // Check if category is used in transactions
  const transaction = await db.query.transactions.findFirst({
    where: eq(schema.transactions.categoryId, id),
  });

  if (transaction) {
    throw new Error(
      "Kategori ini tidak dapat dihapus karena masih digunakan dalam transaksi.",
    );
  }

  await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/dashboard", "layout");
}

export async function updateCategory(
  id: number,
  formData: {
    name: string;
    type: "income" | "expense";
    color?: string;
    icon?: string;
    priority?: "Kebutuhan" | "Keinginan" | "Tabungan" | "Lainnya";
  }
) {
  await db.update(schema.categories).set({
    ...formData,
  }).where(eq(schema.categories.id, id));
  revalidatePath("/dashboard", "layout");
}

