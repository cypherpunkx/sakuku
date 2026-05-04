import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingDown,
  PieChart,
} from "lucide-react";

interface FinancialSummaryProps {
  currentBalance: number;
  monthlyIncome: number;
  rangeIncome: number;
  totalPenting: number; // Range specific
  totalSekunder: number; // Range specific
  monthlyPenting: number; // Always monthly
  monthlySekunder: number; // Always monthly
  range: string;
}

export function FinancialSummary({
  currentBalance,
  monthlyIncome,
  rangeIncome,
  totalPenting,
  totalSekunder,
  monthlyPenting,
  monthlySekunder,
  range,
}: FinancialSummaryProps) {
  const totalPengeluaranRange = totalPenting + totalSekunder;
  const totalPengeluaranBulanan = monthlyPenting + monthlySekunder;

  // "Sisa Anggaran" is more useful as a monthly status
  const sisaAnggaran = monthlyIncome - totalPengeluaranBulanan;
  const usagePercentageRange =
    monthlyIncome > 0 ? (totalPengeluaranRange / monthlyIncome) * 100 : 0;

  const currentMonthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const items = [
    {
      title: "Saldo Total",
      value: `Rp ${currentBalance.toLocaleString("id-ID")}`,
      change: `Posisi ${currentMonthLabel}`,
      icon: Wallet,
      color: currentBalance > 0 ? "text-emerald-500" : "text-rose-500",
      trend: currentBalance > 0 ? "up" : "down",
    },
    {
      title:
        range === "daily"
          ? "Pengeluaran Hari Ini"
          : range === "yearly"
            ? "Pengeluaran Tahun Ini"
            : "Pengeluaran Bulan Ini",
      value: `Rp ${totalPengeluaranRange.toLocaleString("id-ID")}`,
      change:
        monthlyIncome > 0
          ? `${usagePercentageRange.toFixed(1)}% dari pemasukan bulan ini`
          : "Belum ada pemasukan",
      icon: TrendingDown,
      color: (totalPengeluaranRange === 0 || (usagePercentageRange < 80 && monthlyIncome > 0)) ? "text-emerald-500" : "text-rose-500",
      trend: (totalPengeluaranRange === 0 || (usagePercentageRange < 80 && monthlyIncome > 0)) ? "up" : "down",
    },
    {
      title: range === "daily" ? "Sisa Budget Bulan Ini" : "Sisa Anggaran",
      value: `Rp ${sisaAnggaran.toLocaleString("id-ID")}`,
      change: `Arus kas ${currentMonthLabel.split(" ")[0]}`,
      icon: PieChart,
      color: sisaAnggaran > 0 ? "text-primary" : "text-rose-500",
      trend: (sisaAnggaran > 0 || (monthlyIncome === 0 && sisaAnggaran === 0)) ? "up" : "down",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.title}
          className="border-border/40 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden group relative transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 cursor-default"
          style={{ transform: "translateZ(0)" }} // Force GPU acceleration for smoother transitions
        >
          {/* Animated Background Glow */}
          <div className="absolute -right-8 -top-8 size-24 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors duration-500 rounded-full" />
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-xs font-bold tracking-widest uppercase text-muted-foreground/80">
              {item.title}
            </CardTitle>
            <div
              className={`p-2.5 rounded-xl bg-background/40 border border-border/40 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-sm`}
            >
              <item.icon
                className={`h-4.5 w-4.5 ${item.color} transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]`}
              />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-2">
            <div className="text-2xl font-black tracking-tight text-gradient-primary">
              {item.value}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {item.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {item.trend === "up" ? "Safe" : "Warning"}
              </div>
              <p className="text-[11px] text-muted-foreground/90 font-medium">
                {item.change}
              </p>
            </div>
          </CardContent>

          {/* Bottom Accent Line */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-linear-to-r from-primary to-accent transition-all duration-700 group-hover:w-full" />
        </Card>
      ))}
    </section>
  );
}
