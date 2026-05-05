import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, Receipt, Target, HeartPulse } from "lucide-react";
import { BudgetInsight503020 } from "../_components/budget-insight";
import { FinancialSummary } from "../_components/financial-summary";
import { ExpenseTabContent } from "../_components/tabs/expense-tab-content";
import { BudgetTabContent } from "../_components/tabs/budget-tab-content";
import { HealthTabContent } from "../_components/tabs/health-tab-content";
import { BillTabContent } from "../_components/tabs/bill-tab-content";
import { SavingsTabContent } from "../_components/tabs/savings-tab-content";
import { AddTransactionModal } from "../_components/transaction-modal";
import { OnboardingModal } from "../_components/onboarding-modal";
import { 
  getSummaryData, 
  getBudgetData, 
  getTransactionsData, 
  getBillsData, 
  getSavingsData,
  getUser
} from "@/lib/actions";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Suspense } from "react";
import { SummarySkeleton, InsightSkeleton, TabsSkeleton } from "../_components/dashboard-skeletons";

export const metadata: Metadata = {
  title: "Ringkasan",
};

// --- Wrapper Components for Streaming ---

async function SummaryWrapper({ range }: { range: string }) {
  const data = await getSummaryData(range);
  return (
    <FinancialSummary
      currentBalance={data.currentBalance}
      monthlyIncome={data.monthlyIncome}
      rangeIncome={data.rangeIncome}
      totalKebutuhan={data.totalKebutuhan}
      totalKeinginan={data.totalKeinginan}
      monthlyKebutuhan={data.monthlyKebutuhan}
      monthlyKeinginan={data.monthlyKeinginan}
      range={range}
      currency={data.currency}
    />
  );
}

async function InsightWrapper() {
  const data = await getBudgetData();
  const summary = await getSummaryData("monthly"); // For baseline income
  
  return (
    <BudgetInsight503020
      totalIncome={summary.monthlyIncome}
      needs={summary.totalKebutuhan}
      wants={summary.totalKeinginan}
      savings={summary.monthlyIncome - (summary.monthlyKebutuhan + summary.monthlyKeinginan)}
      overBudgetCategories={data.budgets
        .filter((b) => b.spent > b.amountLimit)
        .map((b) => b.category?.name || "Tanpa Kategori")}
      currency={summary.currency}
    />
  );
}

async function TabsWrapper({ 
  range, tab, page, search, category 
}: { 
  range: string, tab: string, page: string, search: string, category: string 
}) {
  const [transactions, budgets, bills, savings, summary] = await Promise.all([
    getTransactionsData(range, parseInt(page), 10, search, category),
    getBudgetData(),
    getBillsData(),
    getSavingsData(),
    getSummaryData(range)
  ]);

  const activeTab = tab === "pembelajaran" ? "target" : tab;

  return (
    <Tabs
      value={activeTab}
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
            value="kesehatan"
            asChild
            className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-rose-500 data-[state=active]:shadow-[0_4px_12px_rgba(244,63,94,0.2)] data-[state=active]:border-rose-500/40 border border-transparent active:scale-95 gap-2.5"
          >
            <Link
              href={`/dashboard?range=${range}&tab=kesehatan`}
              scroll={false}
            >
              <div className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-data-[state=active]:bg-rose-500 group-data-[state=active]:text-white transition-all duration-300">
                <HeartPulse className="size-4" />
              </div>
              Kesehatan
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

        <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/40 backdrop-blur-md">
          {["daily", "monthly", "yearly"].map((r) => (
            <Link
              key={r}
              href={`/dashboard?range=${r}`}
              scroll={false}
              className={cn(
                "rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all border border-transparent",
                range === r
                  ? "bg-background text-primary shadow-sm border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r === "daily" ? "Harian" : r === "monthly" ? "Bulanan" : "Tahunan"}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <TabsContent value="pengeluaran">
          <ExpenseTabContent
            dataPengeluaran={transactions.dataPengeluaran}
            totalKebutuhan={summary.totalKebutuhan}
            totalKeinginan={summary.totalKeinginan}
            recentTransactions={transactions.transactions}
            categories={transactions.categories}
            pagination={transactions.pagination}
            currency={summary.currency}
            monthlyIncome={summary.monthlyIncome}
            currentBalance={summary.currentBalance}
          />
        </TabsContent>

        <TabsContent value="anggaran">
          <BudgetTabContent
            initialBudgets={budgets.budgets}
            allCategories={budgets.categories}
            monthlyIncome={summary.monthlyIncome}
            totalMonthlyExpenses={summary.monthlyKebutuhan + summary.monthlyKeinginan}
            currency={summary.currency}
          />
        </TabsContent>

        <TabsContent value="kesehatan">
          <HealthTabContent
            totalIncome={summary.monthlyIncome}
            totalKebutuhan={summary.monthlyKebutuhan}
            totalKeinginan={summary.monthlyKeinginan}
            currentBalance={summary.currentBalance}
            currency={summary.currency}
          />
        </TabsContent>

        <TabsContent value="tagihan">
          <BillTabContent initialBills={bills} currency={summary.currency} />
        </TabsContent>

        <TabsContent value="target">
          <SavingsTabContent initialGoals={savings} currency={summary.currency} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

// Separate AddModal to fetch its own categories
async function AddModalWrapper() {
  const [{ categories }, user] = await Promise.all([
    getTransactionsData(),
    getUser()
  ]);
  return <AddTransactionModal categories={categories} currency={user?.currency ?? undefined} />;
}

async function GreetingWrapper() {
  const user = await getUser();
  const userName = user?.name?.split(" ")[0] || "Teman";
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Selamat Pagi" : hours < 17 ? "Selamat Siang" : "Selamat Malam";

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-black tracking-tight text-gradient-primary">
        {greeting}, {userName}!
      </h1>
      <p className="text-muted-foreground font-medium">
        Berikut adalah ringkasan kesehatan finansial Anda hari ini.
      </p>
    </div>
  );
}

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

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Suspense fallback={<div className="h-20 w-64 bg-muted/10 animate-pulse rounded-xl" />}>
        <GreetingWrapper />
      </Suspense>

      <Suspense fallback={<SummarySkeleton />}>
        <SummaryWrapper range={range} />
      </Suspense>

      <Suspense fallback={<InsightSkeleton />}>
        <InsightWrapper />
      </Suspense>

      <section className="flex flex-col gap-6">
        <Suspense fallback={<TabsSkeleton />}>
          <TabsWrapper 
            range={range} 
            tab={tab} 
            page={page} 
            search={search} 
            category={category} 
          />
        </Suspense>
      </section>

      <Suspense fallback={null}>
        <AddModalWrapper />
      </Suspense>

      <Suspense fallback={null}>
        <OnboardingWrapper />
      </Suspense>
    </div>
  );
}

async function OnboardingWrapper() {
  const user = await getUser();
  if (!user) return null;
  return <OnboardingModal user={user} />;
}
