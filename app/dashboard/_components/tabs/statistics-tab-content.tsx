"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Info,
  PieChart as PieIcon,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "../empty-state";
import { Wallet } from "lucide-react";

interface StatisticsTabContentProps {
  dailyStats: {
    date: string;
    income: number;
    expense: number;
  }[];
  categoryStats: {
    name: string;
    value: number;
    color: string | null;
  }[];
  targetMonth: string; // YYYY-MM
  comparison: {
    prevIncome: number;
    prevExpense: number;
  };
}

import { CHART_COLORS } from "@/lib/constants";

export function StatisticsTabContent({
  dailyStats,
  categoryStats,
  targetMonth,
  comparison,
}: StatisticsTabContentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format data for the chart
  const chartData = dailyStats.map((item) => {
    const d = new Date(item.date);
    return {
      ...item,
      formattedDate: d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
    };
  });

  // Calculate some basic insights
  const totalIncome = dailyStats.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = dailyStats.reduce((acc, curr) => acc + curr.expense, 0);
  const averageExpense = totalExpense / (dailyStats.length || 1);

  const peakExpenseDay = dailyStats.reduce(
    (prev, current) => (prev.expense > current.expense ? prev : current),
    { date: "-", expense: 0 },
  );

  // Calculate percentage changes
  const calculateChange = (current: number, prev: number) => {
    if (prev === 0) return null;
    return ((current - prev) / prev) * 100;
  };

  const expenseChange = calculateChange(totalExpense, comparison.prevExpense);
  const netCashFlowCurrent = totalIncome - totalExpense;
  const netCashFlowPrev = comparison.prevIncome - comparison.prevExpense;
  const netChange = calculateChange(netCashFlowCurrent, netCashFlowPrev);

  // Process Category Stats for Phase 2
  const sortedCategories = [...categoryStats].sort((a, b) => b.value - a.value);
  const topCategories = sortedCategories.slice(0, 5);

  const hasChartData = dailyStats.some((d) => d.income > 0 || d.expense > 0);
  const hasCategoryData = categoryStats.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 size-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Total Pengeluaran
            </CardDescription>
            <CardTitle className="text-2xl font-black tracking-tight">
              Rp {totalExpense.toLocaleString("id-ID")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseChange !== null ? (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold w-fit px-2 py-0.5 rounded-full transition-all duration-500",
                  expenseChange > 0
                    ? "text-rose-500 bg-rose-500/10"
                    : "text-emerald-500 bg-emerald-500/10",
                )}
              >
                {expenseChange > 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {Math.abs(expenseChange).toFixed(1)}%{" "}
                {expenseChange > 0 ? "naik" : "turun"} dari bln lalu
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-white/5 w-fit px-2 py-0.5 rounded-full">
                <Info className="size-3" />
                Data Bulan Pertama
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 size-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Pengeluaran Puncak
            </CardDescription>
            <CardTitle className="text-2xl font-black tracking-tight">
              Rp {peakExpenseDay.expense.toLocaleString("id-ID")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 w-fit px-2 py-0.5 rounded-full">
              <Calendar className="size-3" />
              {peakExpenseDay.date !== "-"
                ? new Date(peakExpenseDay.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })
                : "Tidak ada data"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30 backdrop-blur-md overflow-hidden relative group">
          <div className="absolute -right-4 -top-4 size-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              Arus Kas Bersih (Surplus)
            </CardDescription>
            <CardTitle
              className={cn(
                "text-2xl font-black tracking-tight",
                netCashFlowCurrent >= 0 ? "text-emerald-500" : "text-rose-500",
              )}
            >
              Rp {netCashFlowCurrent.toLocaleString("id-ID")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {netChange !== null ? (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-bold w-fit px-2 py-0.5 rounded-full transition-all duration-500",
                  netChange >= 0
                    ? "text-emerald-500 bg-emerald-500/10"
                    : "text-rose-500 bg-rose-500/10",
                )}
              >
                {netChange >= 0 ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {Math.abs(netChange).toFixed(1)}%{" "}
                {netChange >= 0 ? "lebih baik" : "lebih rendah"}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-white/5 w-fit px-2 py-0.5 rounded-full">
                <Info className="size-3" />
                Analisis Baru Dimulai
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Phase 4 - Point 3: AI Predictive Card (Only for current month) */}
      {(() => {
        const now = new Date();
        const currentMonthStr = now.toLocaleDateString("en-CA").slice(0, 7);
        if (targetMonth !== currentMonthStr) return null;

        const [year, month] = targetMonth.split("-").map(Number);
        const totalDaysInMonth = new Date(year, month, 0).getDate();
        const daysElapsed = now.getDate();
        const remainingDays = totalDaysInMonth - daysElapsed;

        if (remainingDays <= 0) return null;

        const burnRate = totalExpense / daysElapsed;
        const projectedAdditionalExpense = burnRate * remainingDays;
        const projectedTotalExpense = totalExpense + projectedAdditionalExpense;
        const projectedFinalBalance = totalIncome - projectedTotalExpense;

        const isSafe = projectedFinalBalance >= 0;
        
        // Kalkulasi batas belanja harian aman agar tidak defisit
        const remainingBudget = totalIncome - totalExpense;
        const safeDailyBudget = remainingBudget > 0 ? remainingBudget / remainingDays : 0;

        return (
          <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="absolute right-0 top-0 size-32 bg-primary/10 rounded-full blur-3xl" />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-md bg-primary text-[8px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                      AI Forecast
                    </div>
                    <span className="text-xs font-bold text-primary/80">
                      Prediksi Akhir Bulan{" "}
                      {now.toLocaleDateString("id-ID", { month: "long" })}
                    </span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight leading-tight">
                    Estimasi Saldo Anda:{" "}
                    <span
                      className={isSafe ? "text-emerald-500" : "text-rose-500"}
                    >
                      Rp{" "}
                      {Math.round(projectedFinalBalance).toLocaleString(
                        "id-ID",
                      )}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium max-w-xl">
                    Berdasarkan rata-rata belanja{" "}
                    <span className="text-foreground font-bold">
                      Rp {Math.round(burnRate).toLocaleString("id-ID")}/hari
                    </span>
                    , Anda diperkirakan akan menghabiskan tambahan{" "}
                    <span className="text-foreground font-bold">
                      Rp{" "}
                      {Math.round(projectedAdditionalExpense).toLocaleString(
                        "id-ID",
                      )}
                    </span>{" "}
                    hingga akhir bulan. 
                    {safeDailyBudget > 0 && !isSafe && (
                      <span className="block mt-1 text-amber-500 font-bold italic">
                        Tips: Batasi belanja Anda menjadi Rp {Math.round(safeDailyBudget).toLocaleString("id-ID")}/hari agar saldo tetap positif.
                      </span>
                    )}
                  </p>
                </div>
                <div
                  className={cn(
                    "shrink-0 px-6 py-4 rounded-2xl border flex flex-col items-center gap-1 min-w-[140px]",
                    isSafe
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-rose-500/10 border-rose-500/20",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      isSafe ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {isSafe ? "Status Aman" : "Waspada Defisit"}
                  </span>
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center",
                      isSafe ? "bg-emerald-500" : "bg-rose-500",
                    )}
                  >
                    {isSafe ? (
                      <TrendingUp className="size-5 text-white" />
                    ) : (
                      <TrendingDown className="size-5 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Main Chart Card */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 size-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-xl font-black tracking-tight">
              Tren Arus Kas
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground/90">
              Visualisasi pergerakan uang masuk dan keluar.
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Pemasukan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Pengeluaran
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] w-full pt-0">
          {isMounted && hasChartData ? (
            <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0}>
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="formattedDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                  minTickGap={30}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                  tickFormatter={(val) => {
                    if (val >= 1000000)
                      return `${(val / 1000000).toFixed(1).replace(".0", "")} Jt`;
                    if (val >= 1000) return `${val / 1000} rb`;
                    return val;
                  }}
                  width={60}
                />
                <Tooltip
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "rgba(9, 9, 11, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    padding: "12px 16px",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                  labelStyle={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "10px",
                    marginBottom: "8px",
                    fontWeight: 800,
                  }}
                  formatter={(value: any) => [
                    `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  animationDuration={2000}
                  strokeLinecap="round"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#f43f5e"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorExpense)"
                  animationDuration={2000}
                  strokeLinecap="round"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={Wallet}
              title="Belum Ada Data"
              description="Catat transaksi pertama Anda untuk melihat visualisasi tren arus kas."
              className="h-full"
            />
          )}
        </CardContent>
      </Card>

      {/* Phase 2: Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="size-4 text-primary" />
              <CardTitle className="text-lg font-black tracking-tight">
                Distribusi Pengeluaran
              </CardTitle>
            </div>
            <CardDescription className="font-medium text-muted-foreground/90">
              Persentase belanja per kategori bulan ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isMounted && hasCategoryData ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100} minWidth={0}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.color ||
                          CHART_COLORS[index % CHART_COLORS.length]
                        }
                        className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(9, 9, 11, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "16px",
                      backdropFilter: "blur(16px)",
                    }}
                    itemStyle={{
                      fontSize: "10px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                    }}
                    formatter={(value: any) => [
                      `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={PieIcon}
                title="Tidak Ada Data"
                description="Belum ada pengeluaran berdasarkan kategori bulan ini."
                className="h-full"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight">
              Kategori Terpopuler
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground/90">
              5 kategori dengan pengeluaran tertinggi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasCategoryData ? (
              topCategories.map((cat, i) => {
                const percentage =
                  totalExpense > 0 ? (cat.value / totalExpense) * 100 : 0;
                // Get the same color logic for consistency
                const catColor =
                  cat.color || CHART_COLORS[i % CHART_COLORS.length];

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{
                            backgroundColor: catColor,
                          }}
                        />
                        {cat.name}
                      </span>
                      <span className="text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-1.5 bg-white/5"
                      indicatorClassName="transition-all duration-1000"
                      style={
                        {
                          "--progress-foreground": catColor,
                        } as React.CSSProperties
                      }
                    />
                    <div className="text-[10px] font-black text-muted-foreground/75 text-right uppercase tracking-widest">
                      Rp {cat.value.toLocaleString("id-ID")}
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="List Kosong"
                description="Catatan pengeluaran Anda akan muncul di sini."
                className="py-12"
              />
            )}
          </CardContent>
        </Card>
      </div>
      {/* Phase 3: Spending Heatmap */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-tight">
            Intensitas Pengeluaran Harian
          </CardTitle>
          <CardDescription className="font-medium text-muted-foreground/90">
            Mendeteksi pola hari-hari dengan pengeluaran tinggi bulan ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {(() => {
              const [year, month] = targetMonth.split("-").map(Number);
              const daysInMonth = new Date(year, month, 0).getDate();
              const monthIndex = month - 1;
              const dateObj = new Date(year, monthIndex, 1);

              const maxDayExpense = Math.max(
                ...dailyStats.map((d) => d.expense),
                1,
              );

              return Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayData = dailyStats.find((d) => d.date === dateStr);
                const expense = dayData?.expense || 0;

                // Calculate intensity level (0-4)
                let intensity = 0;
                if (expense > 0) {
                  const ratio = expense / maxDayExpense;
                  if (ratio < 0.25) intensity = 1;
                  else if (ratio < 0.5) intensity = 2;
                  else if (ratio < 0.75) intensity = 3;
                  else intensity = 4;
                }

                return (
                  <div key={day} className="group relative">
                    <div
                      role="img"
                      aria-label={`Tanggal ${day} ${dateObj.toLocaleDateString("id-ID", { month: "long" })}: Rp ${expense.toLocaleString("id-ID")}`}
                      className={cn(
                        "size-8 md:size-10 rounded-lg transition-all duration-300 border border-white/5 cursor-help",
                        intensity === 0 && "bg-white/5",
                        intensity === 1 && "bg-rose-500/20",
                        intensity === 2 && "bg-rose-500/40",
                        intensity === 3 && "bg-rose-500/70",
                        intensity === 4 &&
                          "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]",
                      )}
                    />
                    {/* Custom Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                      <div className="text-white/80 mb-1">
                        {day}{" "}
                        {dateObj.toLocaleDateString("id-ID", { month: "long" })}
                      </div>
                      <div className="text-rose-500">
                        Rp {expense.toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Hemat
            </span>
            <div className="flex gap-1">
              <div className="size-3 rounded-sm bg-white/5" />
              <div className="size-3 rounded-sm bg-rose-500/20" />
              <div className="size-3 rounded-sm bg-rose-500/40" />
              <div className="size-3 rounded-sm bg-rose-500/70" />
              <div className="size-3 rounded-sm bg-rose-500" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Boros
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
