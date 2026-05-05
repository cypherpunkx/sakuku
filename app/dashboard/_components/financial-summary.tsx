import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
  PieChart,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface FinancialSummaryProps {
  currentBalance: number;
  monthlyIncome: number;
  rangeIncome: number;
  totalKebutuhan: number; // Range specific
  totalKeinginan: number; // Range specific
  monthlyKebutuhan: number; // Always monthly
  monthlyKeinginan: number; // Always monthly
  range: string;
  currency?: string;
}

export function FinancialSummary({
  currentBalance,
  monthlyIncome,
  rangeIncome,
  totalKebutuhan,
  totalKeinginan,
  monthlyKebutuhan,
  monthlyKeinginan,
  range,
  currency = "IDR",
}: FinancialSummaryProps) {
  const totalPengeluaranRange = totalKebutuhan + totalKeinginan;
  const totalPengeluaranBulanan = monthlyKebutuhan + monthlyKeinginan;

  // "Sisa Anggaran" is more useful as a monthly status
  const sisaAnggaran = monthlyIncome - totalPengeluaranBulanan;
  const usagePercentageRange =
    monthlyIncome > 0 ? (totalPengeluaranRange / monthlyIncome) * 100 : 0;

  const today = new Date();
  const currentMonthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(today);

  const currentFullDateLabel = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(today);

  const items = [
    {
      title: "Saldo Total",
      value: formatCurrency(currentBalance, currency),
      change: 
        range === "daily" 
          ? `Per ${currentFullDateLabel}`
          : range === "yearly"
            ? `Posisi Tahun ${today.getFullYear()}`
            : `Posisi ${currentMonthLabel}`,
      icon: Wallet,
      color: currentBalance > 0 ? "text-emerald-500" : "text-rose-500",
      valueColor: "text-primary",
      accentColor: "from-primary to-purple-500",
      glowColor: "bg-primary/10",
      hoverBorder: "hover:border-primary/50",
      trend: currentBalance > 0 ? "up" : "down",
    },
    {
      title:
        range === "daily"
          ? "Pengeluaran Hari Ini"
          : range === "yearly"
            ? "Pengeluaran Tahun Ini"
            : "Pengeluaran Bulan Ini",
      value: formatCurrency(totalPengeluaranRange, currency),
      change:
        monthlyIncome > 0
          ? `${usagePercentageRange > 999 ? ">999" : usagePercentageRange.toFixed(1)}% dari pemasukan ${
              range === "daily"
                ? "hari ini"
                : range === "yearly"
                  ? "tahun ini"
                  : "bulan ini"
            }`
          : range === "daily"
            ? "Belum ada pemasukan hari ini"
            : "Belum ada pemasukan",
      icon: TrendingDown,
      color:
        totalPengeluaranRange === 0 || (usagePercentageRange < 85 && monthlyIncome > 0)
          ? "text-emerald-500"
          : usagePercentageRange <= 95
            ? "text-amber-500"
            : "text-rose-500",
      valueColor: "text-rose-500",
      accentColor: "from-rose-500 to-rose-600",
      glowColor: "bg-rose-500/10",
      hoverBorder: "hover:border-rose-500/50",
      trend:
        totalPengeluaranRange === 0 || (usagePercentageRange < 85 && monthlyIncome > 0)
          ? "safe"
          : usagePercentageRange <= 95
            ? "warning"
            : "danger",
    },
    {
      title:
        range === "daily"
          ? "Arus Kas Hari Ini"
          : range === "yearly"
            ? "Arus Kas Tahun Ini"
            : "Sisa Anggaran",
      value: formatCurrency(sisaAnggaran, currency),
      change:
        range === "daily"
          ? `Sisa saldo dari transaksi hari ini`
          : range === "yearly"
            ? `Akumulasi tahun ${today.getFullYear()}`
            : `Arus kas ${currentMonthLabel.split(" ")[0]}`,
      icon: PieChart,
      color: sisaAnggaran > 0 ? "text-emerald-500" : "text-rose-500",
      valueColor: sisaAnggaran >= 0 ? "text-emerald-500" : "text-rose-500",
      accentColor: sisaAnggaran >= 0 ? "from-emerald-500 to-emerald-600" : "from-rose-500 to-rose-600",
      glowColor: sisaAnggaran >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10",
      hoverBorder: sisaAnggaran >= 0 ? "hover:border-emerald-500/50" : "hover:border-rose-500/50",
      trend:
        sisaAnggaran > 0 || (monthlyIncome === 0 && sisaAnggaran === 0)
          ? "safe"
          : "danger",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const trendLabels: Record<string, string> = {
          safe: "Aman",
          warning: "Waspada",
          danger: "Bahaya",
          up: "Aman",
          down: "Bahaya",
        };

        const trendColors: Record<string, string> = {
          safe: "bg-emerald-500/10 text-emerald-500",
          warning: "bg-amber-500/10 text-amber-500",
          danger: "bg-rose-500/10 text-rose-500",
          up: "bg-emerald-500/10 text-emerald-500",
          down: "bg-rose-500/10 text-rose-500",
        };

        return (
          <Card
            key={item.title}
            className={cn(
              "border-border/40 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden group relative transition-all duration-500 hover:shadow-2xl cursor-default",
              item.hoverBorder
            )}
            style={{ transform: "translateZ(0)" }}
          >
            {/* Animated Background Glow */}
            <div className={cn("absolute -right-8 -top-8 size-24 blur-3xl transition-colors duration-500 rounded-full", item.glowColor)} />
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-background/40 border border-border/40 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-sm">
                <item.icon
                  aria-hidden="true"
                  className={`h-4.5 w-4.5 ${item.color} transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]`}
                />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <div className={cn("text-2xl font-black tracking-tight", item.valueColor)}>
                {item.value}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors duration-500 ${trendColors[item.trend]}`}
                >
                  {item.trend === "safe" ? (
                    <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight
                      aria-hidden="true"
                      className={`h-3 w-3 ${item.trend === "warning" ? "animate-pulse" : ""}`}
                    />
                  )}
                  {trendLabels[item.trend]}
                </div>
                <p className="text-[11px] text-muted-foreground/90 font-medium">
                  {item.change}
                </p>
              </div>
            </CardContent>

            {/* Bottom Accent Line */}
            <div className={cn("absolute bottom-0 left-0 h-[2px] w-0 bg-linear-to-r transition-all duration-700 group-hover:w-full", item.accentColor)} />
          </Card>
        );
      })}
    </section>
  );
}
