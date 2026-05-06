"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  HeartPulse, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface HealthTabContentProps {
  totalIncome: number;
  totalKebutuhan: number;
  totalKeinginan: number;
  currentBalance: number;
  currency: string;
}

export function HealthTabContent({
  totalIncome,
  totalKebutuhan,
  totalKeinginan,
  currentBalance,
  currency,
}: HealthTabContentProps) {
  const [efMonths, setEfMonths] = useState(6); // Default 6 months

  // 1. Dana Darurat Analysis
  // Pastikan ada nilai minimal agar tidak terjadi pembagian dengan nol (NaN)
  const monthlyEssential = Math.max(totalKebutuhan || (totalIncome * 0.5), 1);
  const targetEF = monthlyEssential * efMonths;
  const currentEF = Math.max(currentBalance, 0);
  
  // Hitung progres dengan fallback jika targetEF tetap 0 (meskipun sudah di-max)
  const rawEfProgress = targetEF > 0 ? (currentEF / targetEF) * 100 : 0;
  const efProgress = Math.min(isNaN(rawEfProgress) ? 0 : rawEfProgress, 100);
  const isEFSafe = efProgress >= 100;

  // 2. Savings Rate Analysis
  const currentSavings = totalIncome - (totalKebutuhan + totalKeinginan);
  const rawSavingsRate = totalIncome > 0 ? (currentSavings / totalIncome) * 100 : 0;
  const savingsRate = isNaN(rawSavingsRate) ? 0 : rawSavingsRate;
  const isSavingsHealthy = savingsRate >= 20;

  // 3. Overall Health Score (Simple calculation)
  const rawScore = (Math.min(efProgress, 100) * 0.6) + 
                   (Math.min(savingsRate * 5, 100) * 0.4);
  const healthScore = isNaN(rawScore) ? 0 : Math.round(rawScore);

  return (
    <div className="space-y-6">
      {/* Overall Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 size-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24" />
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative size-32 shrink-0">
                <svg className="size-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-muted/20 fill-none"
                    strokeWidth="3"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={cn(
                      "fill-none stroke-primary transition-all duration-1000 ease-out",
                      healthScore > 80 ? "stroke-emerald-500" : healthScore > 50 ? "stroke-primary" : "stroke-rose-500"
                    )}
                    strokeWidth="3"
                    strokeDasharray={`${healthScore}, 100`}
                    strokeLinecap="round"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{healthScore}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Skor</span>
                </div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-black tracking-tight">Audit Kesehatan Finansial</h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  {healthScore > 80 
                    ? "Luar biasa! Pertahanan finansial Anda sangat kokoh. Anda siap untuk mulai berinvestasi lebih agresif." 
                    : healthScore > 50
                      ? "Kondisi keuangan Anda cukup stabil, namun masih ada ruang untuk memperkuat dana cadangan."
                      : "Waspada! Fondasi keuangan Anda masih rentan. Prioritaskan membangun dana darurat bulan ini."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Rasio Menabung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black">
              {Math.round(savingsRate)}%
            </div>
            <div className="space-y-1">
              <Progress value={Math.min(savingsRate * 5, 100)} className="h-2" />
              <p className="text-[10px] text-muted-foreground font-medium italic">
                {isSavingsHealthy 
                  ? "Sesuai target ideal 20%" 
                  : `Kurang ${Math.round(20 - savingsRate)}% dari target ideal`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deep Dive: Emergency Fund */}
      <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Analisis Dana Darurat
              </CardTitle>
              <CardDescription>
                Dana cadangan untuk situasi tak terduga.
              </CardDescription>
            </div>
            <Badge variant={isEFSafe ? "default" : "outline"} className={cn(
              "font-black uppercase tracking-widest text-[10px]",
              isEFSafe ? "bg-emerald-500 hover:bg-emerald-600" : "text-amber-500 border-amber-500/20"
            )}>
              {isEFSafe ? "Tercapai" : "Sedang Dibangun"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Target Proteksi
                  </label>
                  <span className="text-lg font-black text-primary">{efMonths} Bulan</span>
                </div>
                <Slider 
                  value={[efMonths]} 
                  onValueChange={([v]) => setEfMonths(v)}
                  min={3}
                  max={12}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] font-medium opacity-60">
                  <span>3 Bulan (Minimal)</span>
                  <span>12 Bulan (Maksimal)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Kebutuhan Bulanan</span>
                  <span className="font-bold">{formatCurrency(monthlyEssential, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Target Total</span>
                  <span className="text-lg font-black">{formatCurrency(targetEF, currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Progres Dana Darurat</span>
                  <span className={cn(isEFSafe ? "text-emerald-500" : "text-primary")}>
                    {Math.round(efProgress)}%
                  </span>
                </div>
                <Progress 
                  value={efProgress} 
                  className="h-4 rounded-full" 
                  indicatorClassName={cn(
                    "transition-all duration-1000",
                    isEFSafe ? "bg-emerald-500" : "bg-primary"
                  )}
                />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Saat ini Anda memiliki <span className="font-bold text-foreground">{formatCurrency(currentEF, currency)}</span>. 
                  {!isEFSafe && (
                    <> Butuh <span className="font-bold text-foreground">{formatCurrency(targetEF - currentEF, currency)}</span> lagi untuk mencapai target.</>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-border/50 bg-background/30">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Kekuatan</span>
                  </div>
                  <p className="text-xs font-bold">Biaya Esensial Tercover</p>
                </div>
                <div className="p-3 rounded-xl border border-border/50 bg-background/30">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={cn("size-3", isEFSafe ? "text-emerald-500" : "text-rose-500")} />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Kerentanan</span>
                  </div>
                  <p className="text-xs font-bold">{isEFSafe ? "Resiko Rendah" : "Resiko Arus Kas"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Lock className="size-4 text-amber-500" />
              Keamanan Jangka Panjang
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Dana darurat bukan untuk investasi, tetapi untuk perlindungan. Simpan dana ini di instrumen yang likuid seperti RDPU atau Tabungan khusus agar bisa ditarik kapan saja saat dibutuhkan.
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <HeartPulse className="size-4 text-rose-500" />
              Rekomendasi AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-between group rounded-xl">
              Lihat Strategi Investasi
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
