"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertBudget, resetBudgets } from "@/lib/actions";
import { EmptyState } from "../empty-state";
import {
  Utensils,
  Car,
  Zap,
  ShoppingBag,
  CreditCard,
  Tag,
  Home,
  Heart,
  Plane,
  Gift,
  MoreHorizontal,
  ShieldCheck,
  PieChartIcon,
  Info,
  RotateCcw,
  Coffee,
  Smartphone,
  Activity,
  Film,
  Music,
  Briefcase,
  Wrench,
  Bus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatCurrency } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
  Utensils,
  Coffee,
  Car,
  Bus,
  Zap,
  ShoppingBag,
  CreditCard,
  Home,
  Heart,
  Activity,
  Plane,
  Gift,
  Film,
  Music,
  Smartphone,
  Briefcase,
  Wrench,
  MoreHorizontal,
  Tag,
};

interface BudgetTabContentProps {
  initialBudgets: any[];
  allCategories: any[];
  monthlyIncome: number;
  totalMonthlyExpenses: number;
  currency?: string;
}

export function BudgetTabContent({
  initialBudgets,
  allCategories,
  monthlyIncome,
  totalMonthlyExpenses,
  currency = "IDR",
}: BudgetTabContentProps) {
  const router = useRouter();
  const [budgetValues, setBudgetValues] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const DRAFT_KEY = "sakuku_budget_draft";

  // Initialize budget values (only once on mount or when initialBudgets change)
  useEffect(() => {
    if (isInitialized) return;

    const initialValues: Record<number, number> = {};
    initialBudgets.forEach((b) => {
      if (b.categoryId) initialValues[b.categoryId] = b.amountLimit;
    });

    // Check for draft in sessionStorage
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        // Merge draft with initial values (draft takes priority)
        setBudgetValues({ ...initialValues, ...parsedDraft });
        toast.info("Draft anggaran dipulihkan", {
          description: "Perubahan yang belum disimpan telah dimuat kembali.",
          duration: 3000,
        });
      } else {
        setBudgetValues(initialValues);
      }
    } catch (e) {
      setBudgetValues(initialValues);
    }
    
    setIsInitialized(true);
  }, [initialBudgets, isInitialized]);

  // Save draft to sessionStorage whenever values change
  useEffect(() => {
    if (!isInitialized || Object.keys(budgetValues).length === 0) return;
    
    const timeoutId = setTimeout(() => {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(budgetValues));
    }, 500); // Debounce save

    return () => clearTimeout(timeoutId);
  }, [budgetValues, isInitialized]);

  const expenseCategories = allCategories.filter(
    (cat) => cat.type === "expense",
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      const promises = Object.entries(budgetValues).map(([catId, amount]) =>
        upsertBudget(Number(catId), amount),
      );
      await Promise.all(promises);
      sessionStorage.removeItem(DRAFT_KEY);
      toast.success("Anggaran berhasil disimpan!");
      router.refresh(); // Refresh to get updated server data
    } catch (error) {
      toast.error("Gagal menyimpan anggaran");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await resetBudgets();
      setBudgetValues({});
      sessionStorage.removeItem(DRAFT_KEY);
      toast.success("Anggaran berhasil direset!");
      setIsResetDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal mereset anggaran");
    } finally {
      setLoading(false);
    }
  };

  const updateBudgetValue = (catId: number, amount: number) => {
    setBudgetValues((prev) => ({ ...prev, [catId]: amount }));
  };
  const currentMonthYear = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date());
  const currentMonthName = currentMonthYear.split(" ")[0];

  const totalSpent = initialBudgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = initialBudgets.reduce((acc, b) => acc + b.amountLimit, 0);
  const overallUsage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  // --- Daily Insight Calculation ---
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay + 1);

  // Financial Principle: If allocated budget is less than 80% of income,
  // assume the user is following the 50/30/20 rule for the remaining money.
  // IMPORTANT: We use totalMonthlyExpenses (actual spending) for accuracy.
  const targetBase = Math.max(totalLimit, monthlyIncome * 0.8);
  const remainingToSpend = Math.max(0, targetBase - totalMonthlyExpenses);
  const dailyAllowance = remainingToSpend / daysRemaining;
  const isUsingPrinciple = targetBase > totalLimit;

  const isSafe = overallUsage < 85;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Daily Insight Card - Premium Highlight */}
      <Card className="md:col-span-2 border-primary/20 bg-linear-to-br from-primary/10 via-background to-accent/5 backdrop-blur-xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <RotateCcw className="size-32 -rotate-12" />
        </div>
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                Daily Insight • {currentMonthName}
              </Badge>
              {isUsingPrinciple && (
                <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                  Prinsip 50/30/20
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Rp{" "}
                {dailyAllowance.toLocaleString("id-ID", {
                  maximumFractionDigits: 0,
                })}
              </h2>
              <p className="text-muted-foreground font-medium max-w-md">
                {isUsingPrinciple
                  ? "Jatah harian ideal berdasarkan kemampuan finansial Anda bulan ini."
                  : "Jatah harian Anda agar tetap sesuai dengan batas anggaran yang dibuat."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-40 p-4 rounded-[24px] bg-background/40 border border-white/5 backdrop-blur-sm text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                Sisa Hari
              </p>
              <p className="text-2xl font-black">{daysRemaining} Hari</p>
            </div>
            <div className="flex-1 md:w-40 p-4 rounded-[24px] bg-background/40 border border-white/5 backdrop-blur-sm text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                Sisa {isUsingPrinciple ? "Alokasi" : "Limit"}
              </p>
              <p className="text-xl font-black text-emerald-500">
                {remainingToSpend >= 1000000
                  ? `Rp ${(remainingToSpend / 1000000).toFixed(1)} Jt`
                  : `Rp ${(remainingToSpend / 1000).toFixed(0)}k`}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={cn(
                "size-16 rounded-2xl flex items-center justify-center shadow-2xl",
                dailyAllowance > 50000
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-amber-500 shadow-amber-500/20",
              )}
            >
              <ShieldCheck className="size-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Atur Anggaran */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle>Atur Anggaran</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all"
                  onClick={() => setIsResetDialogOpen(true)}
                  title="Reset Anggaran"
                >
                  <RotateCcw className="size-3.5" />
                </Button>
              </div>
              <CardDescription>
                Tentukan batas pengeluaran bulanan Anda.
              </CardDescription>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-3 py-1 rounded-lg">
              {currentMonthYear}
            </Badge>
          </div>
        </CardHeader>

        <AlertDialog
          open={isResetDialogOpen}
          onOpenChange={setIsResetDialogOpen}
        >
          <AlertDialogContent className="bg-background/40 backdrop-blur-3xl border-white/10 shadow-2xl rounded-[32px] overflow-hidden p-0 gap-0">
            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="p-8 space-y-6 relative">
              <AlertDialogHeader>
                <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2">
                  <RotateCcw className="size-6 text-rose-500" />
                </div>
                <AlertDialogTitle className="text-2xl font-black tracking-tight">
                  Reset Anggaran?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground font-medium leading-relaxed">
                  Tindakan ini akan menghapus semua batas anggaran yang telah
                  Anda atur untuk bulan{" "}
                  <span className="text-foreground font-bold">
                    {currentMonthName}
                  </span>
                  . Data transaksi Anda tidak akan hilang atau berubah.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-2">
                <AlertDialogCancel className="flex-1 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 font-bold py-6 transition-all active:scale-95">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  className="flex-1 rounded-2xl bg-rose-500 hover:bg-rose-600 font-black py-6 shadow-xl shadow-rose-500/20 border-none transition-all active:scale-95"
                >
                  <RotateCcw className="size-4 mr-2" />
                  Ya, Reset Sekarang
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <CardContent className="space-y-6">
          {expenseCategories.map((cat) => {
            const budget = initialBudgets.find((b) => b.categoryId === cat.id);
            const amountLimit = budgetValues[cat.id] || 0;
            const spent = budget?.spent || 0;
            const usage = amountLimit > 0 ? (spent / amountLimit) * 100 : 0;
            const Icon = ICON_MAP[cat.icon] || Tag;

            return (
              <div
                key={cat.id}
                className="space-y-3 p-4 rounded-2xl bg-muted/20 border border-border/40 hover:border-primary/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg bg-background/50 border border-border/50 group-hover:scale-110 transition-transform"
                      style={{ color: cat.color }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <Label className="font-bold block">{cat.name}</Label>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                        {cat.priority}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/60">
                      {currency === "USD" ? "$" : "Rp"}
                    </span>
                    <Input
                      type="text"
                      value={amountLimit.toLocaleString(currency === "USD" ? "en-US" : "id-ID")}
                      onChange={(e) => {
                        const val =
                          parseInt(e.target.value.replace(/[,.]/g, "")) || 0;
                        updateBudgetValue(cat.id, val);
                      }}
                      className="w-36 pl-8 h-10 bg-background/50 border-border/50 rounded-xl font-mono font-black text-right focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter">
                      Pemakaian {usage.toFixed(0)}%
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground/60">
                      {formatCurrency(spent, currency)} / {formatCurrency(amountLimit, currency)}
                    </span>
                  </div>
                  <Slider
                    value={[amountLimit > 0 ? (spent / amountLimit) * 100 : 0]}
                    max={100}
                    step={1}
                    className="py-1"
                    disabled
                  />
                  {/* Actually we want the slider to adjust the LIMIT, not show usage? 
                      In financial apps, usually sliders are for adjusting the limit.
                      But here it's disabled to show usage. Let's keep it as is but fix the logic. */}
                </div>
              </div>
            );
          })}
          <Button
            disabled={loading}
            onClick={handleSave}
            className="w-full rounded-2xl font-black py-8 text-lg shadow-xl shadow-primary/20 border border-white/10 active:scale-[0.98] transition-all"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan Anggaran"}
          </Button>
        </CardContent>
      </Card>

      {/* Section: Status Anggaran */}
      <div className="space-y-6">
        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Pengingat Sisa Anggaran</CardTitle>
            <CardDescription>
              Pantau sisa dana di setiap kategori.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {expenseCategories
              .filter((cat) => budgetValues[cat.id] > 0) // Only show categories with a set budget
              .map((cat) => {
                const budget = initialBudgets.find(
                  (b) => b.categoryId === cat.id,
                );
                const amountLimit = budgetValues[cat.id] || 0;
                const spent = budget?.spent || 0;
                const spentRatio = amountLimit > 0 ? spent / amountLimit : 0;
                const isWarning = spentRatio > 0.85 && spentRatio < 0.95;
                const isDanger = spentRatio >= 0.95 && spentRatio < 1;
                const isFull = spentRatio === 1;
                const isOver = spentRatio > 1;

                const remaining = amountLimit - spent;

                return (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                          {cat.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(isWarning || isDanger || isOver) && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[8px] font-black py-0 px-1.5 animate-pulse h-5 uppercase tracking-widest",
                              isOver || isFull
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                            )}
                          >
                            {isOver 
                              ? "Terlampaui!" 
                              : isFull
                                ? "Habis!"
                                : isDanger 
                                  ? "Hampir Habis!" 
                                  : "Waspada!"}
                          </Badge>
                        )}
                        <span className={cn(
                          "font-black text-lg transition-colors duration-500",
                          (isOver || isFull) ? "text-rose-500" : (isWarning || isDanger) ? "text-amber-500" : "text-foreground"
                        )}>
                          {isOver ? (
                            <>
                              Over {formatCurrency(Math.abs(remaining), currency)}
                            </>
                          ) : (
                            <>
                              {formatCurrency(remaining, currency)}{" "}
                              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                                tersisa
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(spentRatio * 100, 100)}
                      className="h-3 bg-muted/20 rounded-full"
                      indicatorClassName={cn(
                        "rounded-full transition-all duration-1000",
                        (isOver || isFull)
                          ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                          : (isWarning || isDanger)
                            ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                            : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
                      )}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">
                      <span>Terpakai: {formatCurrency(spent, currency)}</span>
                      <span>
                        Limit: {formatCurrency(amountLimit, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            {Object.keys(budgetValues).filter(
              (id) => budgetValues[Number(id)] > 0,
            ).length === 0 && (
              <EmptyState 
                icon={PieChartIcon}
                title="Anggaran Belum Diatur"
                description="Tentukan batas pengeluaran untuk setiap kategori agar keuangan Anda lebih terkendali."
                className="py-12"
              />
            )}
          </CardContent>
        </Card>

        {/* Section: Rekomendasi Pengelolaan */}
        <Card
          className={cn(
            "backdrop-blur-sm",
            isSafe
              ? "border-emerald-500/10 bg-emerald-500/5"
              : "border-rose-500/10 bg-rose-500/5",
          )}
        >
          <CardHeader>
            <CardTitle
              className={cn(
                "flex items-center gap-2",
                isSafe ? "text-emerald-500" : "text-rose-500",
              )}
            >
              <ShieldCheck className="size-5" />
              Analisis Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div
                className={cn(
                  "size-10 rounded-full flex items-center justify-center shrink-0",
                  isSafe ? "bg-emerald-500/20" : "bg-rose-500/20",
                )}
              >
                <Info
                  className={cn(
                    "size-5",
                    isSafe ? "text-emerald-500" : "text-rose-500",
                  )}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">
                  {isSafe ? "Kondisi Aman!" : "Perlu Evaluasi!"}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Berdasarkan pola pengeluaran Anda bulan {currentMonthName},
                  anggaran Anda
                  {isSafe
                    ? " secara keseluruhan masih dalam batas wajar. Tetap pertahankan disiplin ini!"
                    : " mulai mendekati batas maksimal. Coba kurangi pengeluaran sekunder untuk sisa bulan ini."}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/statistik")}
              className={cn(
                "w-full rounded-xl font-bold",
                isSafe
                  ? "border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500"
                  : "border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500",
              )}
            >
              Lihat Laporan Lengkap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
