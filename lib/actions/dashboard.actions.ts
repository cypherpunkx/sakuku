"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, or, like, SQL } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const CURRENT_USER_ID = "user_1";

export async function getUser() {
  return await db.query.users.findFirst({
    where: eq(schema.users.id, CURRENT_USER_ID),
  });
}

export async function getStatisticsData(monthStr?: string) {
  const now = new Date();
  const targetMonth = monthStr || now.toLocaleDateString("en-CA").slice(0, 7); // YYYY-MM

  // Calculate previous month
  const [year, month] = targetMonth.split("-").map(Number);
  const prevDate = new Date(year, month - 2, 1);
  const prevMonth = prevDate.toLocaleDateString("en-CA").slice(0, 7);

  // Get daily income and expense for the target month
  const dailyStats = await db
    .select({
      date: sql<string>`strftime('%Y-%m-%d', ${schema.transactions.date})`,
      income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
      expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
    })
    .from(schema.transactions)
    .where(sql`strftime('%Y-%m', ${schema.transactions.date}) = ${targetMonth}`)
    .groupBy(sql`strftime('%Y-%m-%d', ${schema.transactions.date})`)
    .orderBy(sql`strftime('%Y-%m-%d', ${schema.transactions.date})`);

  // Get summary for comparison (prev month)
  const prevSummary = await db
    .select({
      income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
      expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
    })
    .from(schema.transactions)
    .where(sql`strftime('%Y-%m', ${schema.transactions.date}) = ${prevMonth}`);

  // Get category distribution for the target month
  const categoryStats = await db
    .select({
      name: schema.categories.name,
      value: sql<number>`sum(${schema.transactions.amount})`,
      color: schema.categories.color,
    })
    .from(schema.transactions)
    .innerJoin(
      schema.categories,
      eq(schema.transactions.categoryId, schema.categories.id),
    )
    .where(
      and(
        eq(schema.transactions.type, "expense"),
        sql`strftime('%Y-%m', ${schema.transactions.date}) = ${targetMonth}`,
      ),
    )
    .groupBy(schema.categories.id);

  return {
    dailyStats,
    categoryStats,
    targetMonth,
    comparison: {
      prevIncome: prevSummary[0]?.income || 0,
      prevExpense: prevSummary[0]?.expense || 0,
    },
  };
}

export async function getDashboardData(
  range: string = "monthly",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  category: string = "all",
) {
  // Use local time instead of UTC to avoid timezone mismatches
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const currentMonth = currentDay.slice(0, 7); // YYYY-MM
  const currentYear = currentDay.slice(0, 4); // YYYY

  let dateFilter: SQL;
  if (range === "daily") {
    dateFilter = sql`strftime('%Y-%m-%d', ${schema.transactions.date}) = ${currentDay}`;
  } else if (range === "yearly") {
    dateFilter = sql`strftime('%Y', ${schema.transactions.date}) = ${currentYear}`;
  } else {
    // Default: monthly
    dateFilter = sql`strftime('%Y-%m', ${schema.transactions.date}) = ${currentMonth}`;
  }

  const categories = await db.query.categories.findMany();

  // Build dynamic filters for the transaction list
  const filters: (SQL | undefined)[] = [dateFilter];

  if (search) {
    filters.push(
      sql`${schema.transactions.description} LIKE ${"%" + search + "%"}`,
    );
  }

  if (category !== "all") {
    const selectedCat = categories.find((c) => c.name === category);
    if (selectedCat) {
      filters.push(eq(schema.transactions.categoryId, selectedCat.id));
    }
  }

  const transactionsFilter = and(...filters);

  // Parallelize remaining queries
  const [
    transactions,
    totalCountResult,
    balanceResult,
    rangeIncomeSummary,
    monthlyIncomeSummary,
    bills,
    savingsGoals,
    budgets,
  ] = await Promise.all([
    db.query.transactions.findMany({
      with: { category: true },
      where: transactionsFilter,
      orderBy: [desc(schema.transactions.date)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(schema.transactions)
      .where(transactionsFilter),
    db
      .select({
        income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
        expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
      })
      .from(schema.transactions),
    db
      .select({ total: sql<number>`sum(${schema.transactions.amount})` })
      .from(schema.transactions)
      .where(and(eq(schema.transactions.type, "income"), dateFilter)),
    db
      .select({ total: sql<number>`sum(${schema.transactions.amount})` })
      .from(schema.transactions)
      .where(
        and(
          eq(schema.transactions.type, "income"),
          sql`strftime('%Y-%m', ${schema.transactions.date}) = ${currentMonth}`,
        ),
      ),
    db.query.bills.findMany({
      orderBy: [schema.bills.dueDate],
    }),
    db.query.savingsGoals.findMany({
      where: eq(schema.savingsGoals.userId, CURRENT_USER_ID),
    }),
    db.query.budgets.findMany({
      with: {
        category: {
          with: {
            transactions: {
              where: dateFilter,
            },
          },
        },
      },
      where: and(
        eq(schema.budgets.period, currentMonth),
        eq(schema.budgets.userId, CURRENT_USER_ID),
      ),
    }),
  ]);

  const totalTransactions = totalCountResult[0].count;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  // Calculate balance from SQL sums
  const currentBalance =
    Number(balanceResult[0]?.income ?? 0) -
    Number(balanceResult[0]?.expense ?? 0);
  const rangeIncome = Number(rangeIncomeSummary[0]?.total ?? 0);
  const monthlyIncome = Number(monthlyIncomeSummary[0]?.total ?? 0);

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: b.category?.transactions.reduce((acc, t) => acc + t.amount, 0) ?? 0,
  }));

  const user = await getUser();

  // Sync user balance in background if it's different
  if (user && user.balance !== currentBalance) {
    await db
      .update(schema.users)
      .set({ balance: currentBalance })
      .where(eq(schema.users.id, CURRENT_USER_ID));
  }

  const expenseSummary = await db
    .select({
      priority: schema.categories.priority,
      total: sql<number>`sum(${schema.transactions.amount})`,
    })
    .from(schema.transactions)
    .innerJoin(
      schema.categories,
      eq(schema.transactions.categoryId, schema.categories.id),
    )
    .where(and(eq(schema.transactions.type, "expense"), dateFilter))
    .groupBy(schema.categories.priority);

  const totalPenting = Number(
    expenseSummary.find((s) => s.priority === "Penting")?.total ?? 0,
  );
  const totalSekunder = Number(
    expenseSummary.find((s) => s.priority === "Sekunder")?.total ?? 0,
  );

  // 4. Calculate Monthly Expenses (TOTAL for the current month) for budget baselines
  const monthlyExpenseSummary = await db
    .select({
      priority: schema.categories.priority,
      total: sql<number>`sum(${schema.transactions.amount})`,
    })
    .from(schema.transactions)
    .innerJoin(
      schema.categories,
      eq(schema.transactions.categoryId, schema.categories.id),
    )
    .where(
      and(
        eq(schema.transactions.type, "expense"),
        sql`strftime('%Y-%m', ${schema.transactions.date}) = ${currentMonth}`,
      ),
    )
    .groupBy(schema.categories.priority);

  const monthlyPenting = Number(
    monthlyExpenseSummary.find((s) => s.priority === "Penting")?.total ?? 0,
  );
  const monthlySekunder = Number(
    monthlyExpenseSummary.find((s) => s.priority === "Sekunder")?.total ?? 0,
  );

  // Get total spent per category for the chart based on range
  const categorySummary = await db
    .select({
      name: schema.categories.name,
      value: sql<number>`sum(${schema.transactions.amount})`,
      color: schema.categories.color,
      priority: schema.categories.priority,
    })
    .from(schema.transactions)
    .innerJoin(
      schema.categories,
      eq(schema.transactions.categoryId, schema.categories.id),
    )
    .where(and(eq(schema.transactions.type, "expense"), dateFilter))
    .groupBy(schema.categories.id);

  return {
    categories,
    transactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalTransactions,
      pageSize,
    },
    bills,
    savingsGoals,
    budgets: budgetsWithSpent,
    user: user ? { ...user, balance: currentBalance } : null,
    currentBalance,
    rangeIncome,
    monthlyIncome,
    totalPenting,
    totalSekunder,
    monthlyPenting,
    monthlySekunder,
    dataPengeluaran:
      categorySummary.length > 0
        ? categorySummary
        : categories.map((cat) => ({
            name: cat.name,
            value: 0,
            color: cat.color,
            priority: cat.priority,
          })),
  };
}

