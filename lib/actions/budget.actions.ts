"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getUserId } from "../session";

import { budgetSchema } from "../validations";

export async function upsertBudget(categoryId: number, amountLimit: number) {
  budgetSchema.parse({ categoryId, amount: amountLimit });
  const currentMonth = new Date().toLocaleDateString("en-CA").slice(0, 7); // YYYY-MM

  // Check if budget already exists for this category and period
  const existingBudget = await db.query.budgets.findFirst({
    where: and(
      eq(schema.budgets.categoryId, categoryId),
      eq(schema.budgets.period, currentMonth),
      eq(schema.budgets.userId, await getUserId()),
    ),
  });

  if (existingBudget) {
    await db
      .update(schema.budgets)
      .set({ amountLimit })
      .where(eq(schema.budgets.id, existingBudget.id));
  } else {
    await db.insert(schema.budgets).values({
      categoryId,
      amountLimit,
      period: currentMonth,
      userId: await getUserId(),
    });
  }

  revalidatePath("/dashboard", "layout");
}

export async function resetBudgets() {
  const currentMonth = new Date().toLocaleDateString("en-CA").slice(0, 7); // YYYY-MM
  await db
    .delete(schema.budgets)
    .where(
      and(
        eq(schema.budgets.period, currentMonth),
        eq(schema.budgets.userId, await getUserId()),
      ),
    );
  revalidatePath("/dashboard", "layout");
}

