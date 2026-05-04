"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  label: string;
  target: number;
  actual: number;
  amount: number;
  limitAmount: number;
  color: string;
  isSafe: boolean;
  description: string;
}

export function InsightCard({
  label,
  target,
  actual,
  amount,
  limitAmount,
  color,
  isSafe,
  description,
}: InsightCardProps) {
  const diff = limitAmount - amount;
  const isSavings = label.includes("Tabungan");

  // For savings, "safe" means amount >= limitAmount
  // For expenses, "safe" means amount <= limitAmount
  const effectivelySafe = isSafe;

  return (
    <div className="group relative space-y-4 p-5 rounded-[24px] bg-card/30 border border-white/5 backdrop-blur-xl hover:bg-card/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
      {/* Decorative background glow */}
      <div
        className={cn(
          "absolute -right-4 -top-4 size-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          effectivelySafe ? "bg-emerald-500" : "bg-rose-500",
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
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider",
                effectivelySafe
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse",
              )}
            >
              {effectivelySafe
                ? isSavings
                  ? "Target Tercapai"
                  : "Aman"
                : "Overlimit"}
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums tracking-tight">
            {actual.toFixed(1)}
            <span className="text-sm text-muted-foreground ml-0.5">%</span>
          </p>
        </div>
        <div
          className={cn(
            "size-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12",
            effectivelySafe
              ? "bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
              : "bg-rose-500/10 shadow-lg shadow-rose-500/5",
          )}
        >
          {effectivelySafe ? (
            <CheckCircle2 className="size-5 text-emerald-500" />
          ) : (
            <AlertCircle className="size-5 text-rose-500" />
          )}
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-end">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">
              Target {target}% • Rp {limitAmount.toLocaleString("id-ID")}
            </p>
            <p
              className={cn(
                "text-[11px] font-black tracking-tight",
                effectivelySafe ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {diff >= 0
                ? `${isSavings ? "Kurang" : "Sisa"} Rp ${Math.abs(diff).toLocaleString("id-ID")}`
                : `Berlebih Rp ${Math.abs(diff).toLocaleString("id-ID")}`}
            </p>
          </div>
          <span className="text-sm font-bold tabular-nums">
            Rp {amount.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="relative">
          <Progress
            value={Math.min(actual, 100)}
            max={100}
            className="h-2.5 bg-muted/20 rounded-full border border-white/5"
            indicatorClassName={cn(
              "transition-all duration-1000 ease-out rounded-full",
              effectivelySafe
                ? color
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
