import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TrendingDown, Receipt, Target, Award } from "lucide-react";
import { BudgetInsight503020 } from "./_components/budget-insight";
import { FinancialSummary } from "./_components/financial-summary";
import { ExpenseTabContent } from "./_components/tabs/expense-tab-content";
import { BudgetTabContent } from "./_components/tabs/budget-tab-content";
import { BillTabContent } from "./_components/tabs/bill-tab-content";
import { SavingsTabContent } from "./_components/tabs/savings-tab-content";
import { AddTransactionModal } from "./_components/transaction-modal";
import { getDashboardData } from "@/lib/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Ringkasan",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    range?: string;
    tab?: string;
    page?: string;
    search?: string;
    category?: string;
  }>;
}) {
  const {
    range = "monthly",
    tab = "pengeluaran",
    page = "1",
    search = "",
    category = "all",
  } = await searchParams;

  const data = await getDashboardData(
    range,
    parseInt(page),
    10,
    search,
    category,
  );

  // Map "pembelajaran" to "target" in defaultValue if tab is "pembelajaran"
  const activeTab = tab === "pembelajaran" ? "target" : tab;

  const userName = data.user?.name?.split(" ")[0] || "Teman";
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Selamat Pagi" : hours < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Personalized Dashboard Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-gradient-primary">
          {greeting}, {userName}!
        </h1>
        <p className="text-muted-foreground font-medium">
          Berikut adalah ringkasan kesehatan finansial Anda hari ini.
        </p>
      </div>

      {/* Financial Summary Section */}
      <FinancialSummary
        currentBalance={data.currentBalance}
        monthlyIncome={data.monthlyIncome}
        rangeIncome={data.rangeIncome}
        totalPenting={data.totalPenting}
        totalSekunder={data.totalSekunder}
        monthlyPenting={data.monthlyPenting}
        monthlySekunder={data.monthlySekunder}
        range={range}
      />

      {/* 50/30/20 Insight Section */}
      <section>
        <BudgetInsight503020
          totalIncome={data.monthlyIncome} // Use monthly income as baseline
          needs={data.totalPenting}
          wants={data.totalSekunder}
          savings={
            data.monthlyIncome - (data.monthlyPenting + data.monthlySekunder)
          } // Correct monthly savings
          overBudgetCategories={data.budgets
            .filter((b) => b.spent > b.amountLimit)
            .map((b) => b.category?.name || "Tanpa Kategori")}
        />
      </section>

      {/* Main Navigation Section */}
      <section className="flex flex-col gap-6">
        <Tabs
          key={activeTab}
          defaultValue={activeTab}
          className="w-full min-h-[600px] relative"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sticky top-0 z-40 bg-background/95 backdrop-blur-md py-3 px-1 border-b border-border/10 transform-gpu transition-none">
            <TabsList className="inline-flex items-center justify-start rounded-2xl bg-muted/20 p-1.5 text-muted-foreground border border-border/40 backdrop-blur-xl w-full lg:w-fit max-lg:overflow-x-auto lg:overflow-visible no-scrollbar gap-1.5 py-5">
              <TabsTrigger
                value="pengeluaran"
                asChild
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-rose-500 data-[state=active]:shadow-[0_4px_12px_rgba(244,63,94,0.2)] data-[state=active]:border-rose-500/40 border border-transparent active:scale-95 gap-2.5"
              >
                <Link
                  href={`/dashboard?range=${range}&tab=pengeluaran`}
                  scroll={false}
                >
                  <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-data-[state=active]:bg-rose-500 group-data-[state=active]:text-white transition-all duration-300">
                    <TrendingDown className="size-4" />
                  </div>
                  Pengeluaran
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="anggaran"
                asChild
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-emerald-500 data-[state=active]:shadow-[0_4px_12px_rgba(16,185,129,0.2)] data-[state=active]:border-emerald-500/40 border border-transparent active:scale-95 gap-2.5"
              >
                <Link
                  href={`/dashboard?range=${range}&tab=anggaran`}
                  scroll={false}
                >
                  <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-data-[state=active]:bg-emerald-500 group-data-[state=active]:text-white transition-all duration-300">
                    <Target className="size-4" />
                  </div>
                  Anggaran
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="tagihan"
                asChild
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-amber-500 data-[state=active]:shadow-[0_4px_12px_rgba(245,158,11,0.2)] data-[state=active]:border-amber-500/40 border border-transparent active:scale-95 gap-2.5"
              >
                <Link
                  href={`/dashboard?range=${range}&tab=tagihan`}
                  scroll={false}
                >
                  <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-data-[state=active]:bg-amber-500 group-data-[state=active]:text-white transition-all duration-300">
                    <Receipt className="size-4" />
                  </div>
                  Tagihan
                </Link>
              </TabsTrigger>
              <TabsTrigger
                value="target"
                asChild
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 data-[state=active]:border-primary/40 border border-transparent active:scale-95 gap-2.5"
              >
                <Link
                  href={`/dashboard?range=${range}&tab=target`}
                  scroll={false}
                >
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center group-data-[state=active]:bg-primary group-data-[state=active]:text-white transition-all duration-300">
                    <Target className="size-4" />
                  </div>
                  Target
                </Link>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-2xl border border-border/40 backdrop-blur-md">
              <Link
                href="/dashboard?range=daily"
                scroll={false}
                className={cn(
                  "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all",
                  range === "daily"
                    ? "bg-background text-primary shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Harian
              </Link>
              <Link
                href="/dashboard?range=monthly"
                scroll={false}
                className={cn(
                  "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all",
                  range === "monthly"
                    ? "bg-background text-primary shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Bulanan
              </Link>
              <Link
                href="/dashboard?range=yearly"
                scroll={false}
                className={cn(
                  "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all",
                  range === "yearly"
                    ? "bg-background text-primary shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Tahunan
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <TabsContent value="pengeluaran">
              <Suspense fallback={<div className="w-full h-96 bg-muted/20 animate-pulse rounded-2xl" />}>
                <ExpenseTabContent
                  dataPengeluaran={data.dataPengeluaran}
                  totalPenting={data.totalPenting}
                  totalSekunder={data.totalSekunder}
                  recentTransactions={data.transactions}
                  categories={data.categories}
                  pagination={data.pagination}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="anggaran">
              <BudgetTabContent
                initialBudgets={data.budgets}
                allCategories={data.categories}
                monthlyIncome={data.monthlyIncome}
                totalMonthlyExpenses={
                  data.monthlyPenting + data.monthlySekunder
                }
              />
            </TabsContent>

            <TabsContent value="tagihan">
              <BillTabContent initialBills={data.bills} />
            </TabsContent>

            <TabsContent value="target">
              <SavingsTabContent initialGoals={data.savingsGoals} />
            </TabsContent>
          </div>
        </Tabs>
      </section>

      <AddTransactionModal categories={data.categories} />
    </div>
  );
}
