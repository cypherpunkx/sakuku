"use server";

import { db } from "../db";
import * as schema from "../db/schema";
import { eq, and, desc, sql, SQL, gte, lte } from "drizzle-orm";

import { getSession } from "../session";

async function getAuthenticatedUserId() {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error("Unauthorized");
  }
  return session.userId as string;
}

export async function getUser() {
  const userId = await getAuthenticatedUserId();
  return await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
}

/**
 * Mendapatkan rentang tanggal untuk periode anggaran saat ini berdasarkan budgetStartDay user.
 * Contoh: Jika budgetStartDay = 25 dan hari ini 10 Mei, maka rentangnya adalah 25 April - 24 Mei.
 */
export async function getBudgetPeriodRange(
  startDay: number = 1,
  referenceDate: Date = new Date(),
) {
  const now = referenceDate;
  let startDate: Date;
  let endDate: Date;

  if (now.getDate() >= startDay) {
    // Periode dimulai bulan ini
    startDate = new Date(now.getFullYear(), now.getMonth(), startDay);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, startDay - 1);
  } else {
    // Periode dimulai bulan lalu
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, startDay);
    endDate = new Date(now.getFullYear(), now.getMonth(), startDay - 1);
  }

  // Format ke YYYY-MM-DD untuk SQLite
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  // Period label (YYYY-MM) - Kita gunakan bulan di mana periode ini berakhir sebagai label
  const periodLabel = endDate.toISOString().split("T")[0].slice(0, 7);

  return { startStr, endStr, periodLabel };
}

export async function getStatisticsData(monthStr?: string) {
  const user = await getUser();
  const startDay = user?.budgetStartDay || 1;

  // Tentukan tanggal referensi (jika monthStr "2026-05", gunakan akhir bulan tersebut sebagai referensi)
  let referenceDate = new Date();
  if (monthStr) {
    const [year, month] = monthStr.split("-").map(Number);
    referenceDate = new Date(year, month - 1, startDay);
  }

  const {
    startStr,
    endStr,
    periodLabel: targetMonth,
  } = await getBudgetPeriodRange(startDay, referenceDate);

  // Hitung periode sebelumnya untuk perbandingan
  const prevRefDate = new Date(referenceDate);
  prevRefDate.setMonth(prevRefDate.getMonth() - 1);
  const { startStr: prevStart, endStr: prevEnd } = await getBudgetPeriodRange(
    startDay,
    prevRefDate,
  );

  // Get daily income and expense for the target month
  const dailyStats = await db
    .select({
      date: sql<string>`strftime('%Y-%m-%d', ${schema.transactions.date})`,
      income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
      expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
    })
    .from(schema.transactions)
    .where(
      and(
        gte(schema.transactions.date, startStr),
        lte(schema.transactions.date, endStr),
        eq(schema.transactions.userId, await getAuthenticatedUserId()),
      ),
    )
    .groupBy(sql`strftime('%Y-%m-%d', ${schema.transactions.date})`)
    .orderBy(sql`strftime('%Y-%m-%d', ${schema.transactions.date})`);

  // Get summary for comparison (prev month)
  const prevSummary = await db
    .select({
      income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
      expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
    })
    .from(schema.transactions)
    .where(
      and(
        gte(schema.transactions.date, prevStart),
        lte(schema.transactions.date, prevEnd),
        eq(schema.transactions.userId, await getAuthenticatedUserId()),
      ),
    );

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
        gte(schema.transactions.date, startStr),
        lte(schema.transactions.date, endStr),
        eq(schema.transactions.userId, await getAuthenticatedUserId()),
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

export async function getSummaryData(range: string = "monthly") {
  const user = await getUser();
  const startDay = user?.budgetStartDay || 1;
  const { startStr, endStr } = await getBudgetPeriodRange(startDay);

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-CA");
  const currentYear = currentDay.slice(0, 4);

  let dateFilter: SQL | undefined;
  if (range === "daily") {
    dateFilter = sql`strftime('%Y-%m-%d', ${schema.transactions.date}) = ${currentDay}`;
  } else if (range === "yearly") {
    dateFilter = sql`strftime('%Y', ${schema.transactions.date}) = ${currentYear}`;
  } else {
    // Monthly (Budget Cycle)
    dateFilter = and(
      gte(schema.transactions.date, startStr),
      lte(schema.transactions.date, endStr),
    );
  }

  // Tambahkan filter userId
  const finalFilter = and(
    dateFilter,
    eq(schema.transactions.userId, await getAuthenticatedUserId()),
  );

  const [balanceResult, rangeIncomeSummary, expenseSummary] = await Promise.all(
    [
      // 1. Saldo Total (Seluruh Waktu)
      db
        .select({
          income: sql<number>`sum(case when type = 'income' then amount else 0 end)`,
          expense: sql<number>`sum(case when type = 'expense' then amount else 0 end)`,
        })
        .from(schema.transactions)
        .where(eq(schema.transactions.userId, await getAuthenticatedUserId())),

      // 2. Pendapatan Periode Ini
      db
        .select({ total: sql<number>`sum(${schema.transactions.amount})` })
        .from(schema.transactions)
        .where(and(eq(schema.transactions.type, "income"), finalFilter)),

      // 3. Pengeluaran Periode Ini per Prioritas (Kebutuhan vs Keinginan)
      db
        .select({
          priority: schema.categories.priority,
          total: sql<number>`sum(${schema.transactions.amount})`,
        })
        .from(schema.transactions)
        .leftJoin(
          schema.categories,
          eq(schema.transactions.categoryId, schema.categories.id),
        )
        .where(and(eq(schema.transactions.type, "expense"), finalFilter))
        .groupBy(schema.categories.priority),
    ],
  );

  const currentBalance =
    Number(balanceResult[0]?.income ?? 0) -
    Number(balanceResult[0]?.expense ?? 0);
  const monthlyIncome = Number(rangeIncomeSummary[0]?.total ?? 0);

  // Perhitungan pengeluaran yang lebih robust
  const monthlyKebutuhan = Number(
    expenseSummary.find((s) => s.priority === "Kebutuhan")?.total ?? 0,
  );
  
  // Semua yang bukan kebutuhan dianggap keinginan (termasuk Lainnya atau Tanpa Kategori)
  const totalExpenses = Number(balanceResult[0]?.expense ?? 0); // Total pengeluaran (filtered by time in finalFilter? No, balanceResult is all-time)
  
  // Wait, balanceResult is all time. I need monthly total expenses.
  // Let's get it from expenseSummary sum
  const monthlyTotalExpenses = expenseSummary.reduce((acc, curr) => acc + Number(curr.total ?? 0), 0);
  const monthlyKeinginan = monthlyTotalExpenses - monthlyKebutuhan;


  const currency = user?.currency || "IDR";

  return {
    currentBalance,
    monthlyIncome,
    monthlyKebutuhan,
    monthlyKeinginan,
    currency,
    // Aliases for backward compatibility
    totalKebutuhan: monthlyKebutuhan,
    totalKeinginan: monthlyKeinginan,
    rangeIncome: monthlyIncome,
  };
}

export async function getBudgetData() {
  const user = await getUser();
  const startDay = user?.budgetStartDay || 1;
  const { startStr, endStr, periodLabel } =
    await getBudgetPeriodRange(startDay);

  const dateFilter = and(
    gte(schema.transactions.date, startStr),
    lte(schema.transactions.date, endStr),
  );

  const [categories, budgets] = await Promise.all([
    db.query.categories.findMany(),
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
        eq(schema.budgets.period, periodLabel),
        eq(schema.budgets.userId, await getAuthenticatedUserId()),
      ),
    }),
  ]);

  const budgetsWithSpent = budgets.map((b) => ({
    ...b,
    spent: b.category?.transactions.reduce((acc, t) => acc + t.amount, 0) ?? 0,
  }));

  return {
    categories,
    budgets: budgetsWithSpent,
  };
}

export async function getTransactionsData(
  range: string = "monthly",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  category: string = "all",
) {
  const now = new Date();
  const currentDay = now.toLocaleDateString("en-CA");
  const currentYear = currentDay.slice(0, 4);
  const user = await getUser();
  const startDay = user?.budgetStartDay || 1;
  const { startStr, endStr } = await getBudgetPeriodRange(startDay);

  let dateFilter: SQL | undefined;
  if (range === "daily") {
    dateFilter = sql`strftime('%Y-%m-%d', ${schema.transactions.date}) = ${currentDay}`;
  } else if (range === "yearly") {
    dateFilter = sql`strftime('%Y', ${schema.transactions.date}) = ${currentYear}`;
  } else {
    dateFilter = and(
      gte(schema.transactions.date, startStr),
      lte(schema.transactions.date, endStr),
    );
  }

  const categories = await db.query.categories.findMany();
  const filters: (SQL | undefined)[] = [
    dateFilter,
    eq(schema.transactions.userId, await getAuthenticatedUserId()),
  ];

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

  const [transactions, totalCountResult, categorySummary] = await Promise.all([
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
        id: schema.categories.id,
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
      .where(
        and(
          eq(schema.transactions.type, "expense"),
          dateFilter,
          eq(schema.transactions.userId, await getAuthenticatedUserId()),
        ),
      )
      .groupBy(schema.categories.id),
  ]);

  const totalTransactions = totalCountResult[0].count;
  const totalPages = Math.ceil(totalTransactions / pageSize);

  const dataPengeluaran = categories
    .filter((cat) => cat.type === "expense")
    .map((cat) => {
      const summary = categorySummary.find((s) => s.id === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        value: Number(summary?.value || 0),
        color: cat.color,
        priority: cat.priority,
      };
    });

  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages,
      totalTransactions,
      pageSize,
    },
    dataPengeluaran,
    categories,
  };
}

export async function getBillsData() {
  return await db.query.bills.findMany({
    where: eq(schema.bills.userId, await getAuthenticatedUserId()),
    orderBy: [schema.bills.dueDate],
  });
}

export async function getSavingsData() {
  return await db.query.savingsGoals.findMany({
    where: eq(schema.savingsGoals.userId, await getAuthenticatedUserId()),
  });
}

/**
 * @deprecated Gunakan fungsi granular (getSummaryData, getBudgetData, dll) untuk streaming yang lebih baik.
 */
export async function getDashboardData(
  range: string = "monthly",
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  category: string = "all",
) {
  // Shortcut: Menggabungkan hasil dari fungsi-fungsi granular
  const [summary, budget, transactions, bills, savingsGoals] =
    await Promise.all([
      getSummaryData(range),
      getBudgetData(),
      getTransactionsData(range, page, pageSize, search, category),
      getBillsData(),
      getSavingsData(),
    ]);

  return {
    ...summary,
    ...budget,
    ...transactions,
    bills,
    savingsGoals,
  };
}
