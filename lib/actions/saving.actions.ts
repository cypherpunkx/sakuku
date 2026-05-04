"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";

import { getUser } from "./dashboard.actions";

export async function addSavingGoal(formData: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  iconName?: string;
  color?: string;
  dueDate?: string;
}) {
  await db.insert(schema.savingsGoals).values({
    ...formData,
    userId: CURRENT_USER_ID,
  });
  revalidatePath("/dashboard", "layout");
}

export async function updateSavingGoal(
  id: number,
  formData: Partial<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    iconName: string;
    color: string;
    dueDate: string;
  }>
) {
  await db.update(schema.savingsGoals).set({
    ...formData,
  }).where(eq(schema.savingsGoals.id, id));
  revalidatePath("/dashboard", "layout");
}

export async function deleteSavingGoal(id: number) {
  // 1. Disconnect any transactions from this goal first
  await db
    .update(schema.transactions)
    .set({ goalId: null })
    .where(eq(schema.transactions.goalId, id));

  // 2. Delete the goal
  await db.delete(schema.savingsGoals).where(eq(schema.savingsGoals.id, id));
  revalidatePath("/dashboard", "layout");
}

export async function addSavingContribution(id: number, amount: number) {
  const goal = await db.query.savingsGoals.findFirst({
    where: eq(schema.savingsGoals.id, id),
  });

  if (!goal) throw new Error("Target tidak ditemukan");

  // 1. Update goal amount
  await db
    .update(schema.savingsGoals)
    .set({ currentAmount: (goal.currentAmount ?? 0) + amount })
    .where(eq(schema.savingsGoals.id, id));

  // 2. Add as a transaction (optional, but good for history)
  // Find or create "Tabungan" category
  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.name, "Tabungan"),
  });

  if (!category) {
    const result = await db
      .insert(schema.categories)
      .values({
        name: "Tabungan",
        type: "expense",
        icon: "TrendingUp",
        priority: "Sekunder",
        color: "#10b981",
      })
      .returning();
    category = result[0];
  }

  await db.insert(schema.transactions).values({
    amount: amount,
    categoryId: category.id,
    type: "expense",
    description: `Menabung untuk: ${goal.name}`,
    store: "SakuKu Savings",
    date: new Date().toLocaleDateString("en-CA"),
    userId: CURRENT_USER_ID,
    goalId: goal.id,
  });

  // 3. Update user balance
  const user = await getUser();
  if (user) {
    await db
      .update(schema.users)
      .set({ balance: (user.balance ?? 0) - amount })
      .where(eq(schema.users.id, CURRENT_USER_ID));
  }

  revalidatePath("/dashboard", "layout");
}

