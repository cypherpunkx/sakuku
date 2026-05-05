"use server";

import "server-only";
import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { verifySession } from "../dal";
import { getUser } from "./dashboard.actions";
import { transactionSchema } from "../validations";

export async function addTransaction(data: any) {
  const validatedData = transactionSchema.parse(data);
  const formData = validatedData;
  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, formData.categoryName),
  });

  if (!category) {
    const result = await db
      .insert(schema.categories)
      .values({
        name: formData.categoryName,
        type: formData.type,
        color: formData.type === "expense" ? "#ef4444" : "#10b981",
        priority: "Kebutuhan",
      })
      .returning();
    category = result[0];
  }

  const session = await verifySession();
  if (!session.isAuth || !session.userId) throw new Error("Unauthorized");

  await db.insert(schema.transactions).values({
    amount: formData.amount,
    categoryId: category.id,
    type: formData.type,
    description: formData.description || formData.categoryName,
    store: formData.store,
    date: formData.date || new Date().toLocaleDateString("en-CA"),
    userId: session.userId,
  });

  const user = await getUser();
  if (user) {
    const newBalance =
      formData.type === "income"
        ? (user.balance ?? 0) + formData.amount
        : (user.balance ?? 0) - formData.amount;
    await db
      .update(schema.users)
      .set({ balance: newBalance })
      .where(eq(schema.users.id, session.userId));
  }

  revalidatePath("/dashboard", "layout");
}

export async function updateTransaction(id: number, data: any) {
  const validatedData = transactionSchema.parse(data);
  const formData = validatedData;
  const session = await verifySession();
  if (!session.isAuth || !session.userId) throw new Error("Unauthorized");

  const oldTx = await db.query.transactions.findFirst({
    where: and(
      eq(schema.transactions.id, id),
      eq(schema.transactions.userId, session.userId),
    ),
  });
  if (!oldTx)
    throw new Error(
      "Transaksi tidak ditemukan atau Anda tidak memiliki akses.",
    );

  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, formData.categoryName),
  });

  if (!category) {
    const result = await db
      .insert(schema.categories)
      .values({
        name: formData.categoryName,
        type: formData.type,
        color: formData.type === "expense" ? "#ef4444" : "#10b981",
        priority: "Kebutuhan",
      })
      .returning();
    category = result[0];
  }

  await db
    .update(schema.transactions)
    .set({
      amount: formData.amount,
      categoryId: category.id,
      type: formData.type,
      description: formData.description || formData.categoryName,
      store: formData.store,
      date: formData.date || oldTx.date,
    })
    .where(eq(schema.transactions.id, id));

  const user = await getUser();
  if (user) {
    let balance = user.balance ?? 0;
    if (oldTx.type === "income") balance -= oldTx.amount;
    else balance += oldTx.amount;

    if (formData.type === "income") balance += formData.amount;
    else balance -= formData.amount;

    await db
      .update(schema.users)
      .set({ balance })
      .where(eq(schema.users.id, session.userId));
  }

  revalidatePath("/dashboard", "layout");
}

export async function deleteTransaction(id: number) {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) throw new Error("Unauthorized");

  const transaction = await db.query.transactions.findFirst({
    where: and(
      eq(schema.transactions.id, id),
      eq(schema.transactions.userId, session.userId),
    ),
  });

  // If not found or no access
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
      .where(eq(schema.users.id, session.userId));
  }

  // 3. If this was a bill payment, revert bill status to unpaid
  if (transaction.billId) {
    await db
      .update(schema.bills)
      .set({ isPaid: false })
      .where(
        and(
          eq(schema.bills.id, transaction.billId),
          eq(schema.bills.userId, session.userId),
        ),
      );
  }

  // 4. If this was a savings contribution, revert goal current amount
  if (transaction.goalId) {
    const goal = await db.query.savingsGoals.findFirst({
      where: and(
        eq(schema.savingsGoals.id, transaction.goalId),
        eq(schema.savingsGoals.userId, session.userId),
      ),
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
  priority?: "Kebutuhan" | "Keinginan";
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
    priority?: "Kebutuhan" | "Keinginan";
  },
) {
  await db
    .update(schema.categories)
    .set({
      ...formData,
    })
    .where(eq(schema.categories.id, id));
  revalidatePath("/dashboard", "layout");
}
