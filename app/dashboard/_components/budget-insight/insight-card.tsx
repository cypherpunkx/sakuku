"use client";

import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";

interface InsightCardProps {
  label: string;
  target: number;
  actual: number;
  amount: number;
  limitAmount: number;
  color: string;
  isSafe: boolean;
  status?: "safe" | "warning" | "danger";
  description: string;
  hasIncome?: boolean;
  currency?: string;
}

export function InsightCard({
  label,
  target,
  actual,
  amount,
  limitAmount,
  color,
  isSafe,
  status = "safe",
  description,
  hasIncome = true,
  currency = "IDR",
}: InsightCardProps) {
  const diff = limitAmount - amount;
  const isSavings = label.includes("Tabungan");

  // For savings, "safe" means amount >= limitAmount
  // For expenses, "safe" means amount <= limitAmount
  const effectivelySafe = hasIncome ? status === "safe" : true;
  const isWarning = hasIncome && status === "warning";
  const isDanger = hasIncome && status === "danger";

  // Handle extreme percentages
  const isExtremePositive = actual > 999;
  const isExtremeNegative = actual < -999;
  const displayActual = isExtremePositive 
    ? ">999" 
    : isExtremeNegative 
      ? "<-999" 
      : actual.toFixed(1);
      
  const isExtremeOverlimit = isDanger && Math.abs(actual) > 200;
  const isDeficit = isSavings && amount < 0;

  return (
    <div className="group relative space-y-4 p-5 rounded-[24px] bg-card/30 border border-white/5 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
      {/* Decorative background glow */}
      <div
        className={cn(
          "absolute -right-4 -top-4 size-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          !hasIncome
            ? "bg-primary"
            : effectivelySafe
              ? "bg-emerald-500"
              : isWarning
                ? "bg-amber-500"
                : isExtremeOverlimit
                  ? "bg-rose-600"
                  : "bg-rose-500",
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 group-hover:text-primary transition-colors">
              {label}
            </p>
            <div
              className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all",
                !hasIncome
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : effectivelySafe
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : isWarning
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                      : isExtremeOverlimit
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse",
              )}
            >
              {!hasIncome
                ? "Menunggu Pemasukan"
                : effectivelySafe
                  ? isSavings
                    ? "Target Tercapai"
                    : "Aman"
                  : isWarning
                    ? "Waspada"
                    : isExtremeOverlimit
                      ? "Bahaya"
                      : "Overlimit"}
            </div>
          </div>
          <p className={cn(
            "text-3xl font-black tabular-nums tracking-tight transition-colors",
            isDanger && "text-rose-500",
            isWarning && "text-amber-500"
          )}>
            {hasIncome ? displayActual : "0.0"}
            <span className="text-sm text-muted-foreground ml-0.5">%</span>
          </p>
        </div>
        <div
          className={cn(
            "size-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12",
            !hasIncome
              ? "bg-primary/10 shadow-lg shadow-primary/5"
              : effectivelySafe
                ? "bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                : isWarning
                  ? "bg-amber-500/10 shadow-lg shadow-amber-500/5"
                  : "bg-rose-500/10 shadow-lg shadow-rose-500/5",
          )}
        >
          {!hasIncome ? (
            <div className="size-2 rounded-full bg-primary animate-ping" />
          ) : effectivelySafe ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : isWarning ? (
            <AlertTriangle className="size-5 text-amber-500" />
          ) : (
            <AlertCircle className="size-5 text-rose-500" />
          )}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
              Target {target}% • {formatCurrency(limitAmount, currency)}
            </p>
            <p
              className={cn(
                "text-[11px] font-black tracking-tight",
                !hasIncome
                  ? "text-primary/60"
                  : effectivelySafe
                    ? "text-emerald-500"
                    : isWarning
                      ? "text-amber-500"
                      : "text-rose-500",
              )}
            >
              {!hasIncome
                ? "Lengkapi profil keuangan Anda"
                : isDeficit
                  ? `Defisit ${formatCurrency(Math.abs(amount), currency)}`
                  : diff >= 0
                    ? `${isSavings ? "Kurang" : "Sisa"} ${formatCurrency(Math.abs(diff), currency)}`
                    : `Berlebih ${formatCurrency(Math.abs(diff), currency)}`}
            </p>
          </div>
          <span className={cn(
            "text-sm font-bold tabular-nums transition-colors",
            !hasIncome ? "text-muted-foreground/30" : "text-foreground",
            isDeficit && "text-rose-500"
          )}>
            {formatCurrency(amount, currency)}
          </span>
        </div>

        <div className="relative">
          <Progress
            value={hasIncome ? Math.min(Math.abs(actual), 100) : 0}
            max={100}
            className="h-2.5 bg-muted/20 rounded-full border border-white/5"
            indicatorClassName={cn(
              "transition-all duration-1000 ease-out rounded-full",
              !hasIncome
                ? "bg-primary/40"
                : effectivelySafe
                  ? color
                  : isWarning
                    ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                    : isExtremeOverlimit
                      ? "bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.6)]"
                      : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
            )}
          />
        </div>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground/60 font-medium italic opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {description}
      </p>
    </div>
  );
}
