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
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Plus,
  TrendingUp,
  Trash2,
  Calendar,
  Wallet,
  ArrowUpRight,
  Heart,
  Plane,
  Car,
  Home,
  Laptop,
  Briefcase,
  Gift,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState } from "../empty-state";
import { useOptimistic, useState, useTransition } from "react";
import {
  addSavingContribution,
  deleteSavingGoal,
  addSavingGoal,
  updateSavingGoal,
} from "@/lib/actions";
import { toast } from "sonner";
import { format, differenceInDays, isAfter, startOfToday } from "date-fns";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Calendar as CalendarIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ICON_MAP: Record<string, any> = {
  Target,
  Heart,
  Plane,
  Car,
  Home,
  Laptop,
  Briefcase,
  Gift,
  TrendingUp,
  ShieldCheck,
};

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number | null;
  iconName: string | null;
  color: string | null;
  dueDate: string | null;
  currency?: string;
}

interface SavingsTabContentProps {
  initialGoals: any[];
  currency?: string;
}

export function SavingsTabContent({
  initialGoals,
  currency = "IDR",
}: SavingsTabContentProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [isPending, startTransition] = useTransition();

  const [optimisticGoals, addOptimisticAction] = useOptimistic(
    initialGoals,
    (
      state,
      action: { type: "delete" | "contribute"; id: number; amount?: number },
    ) => {
      if (action.type === "delete") {
        return state.filter((g) => g.id !== action.id);
      }
      if (action.type === "contribute") {
        return state.map((g) =>
          g.id === action.id
            ? {
                ...g,
                currentAmount: (g.currentAmount || 0) + (action.amount || 0),
              }
            : g,
        );
      }
      return state;
    },
  );

  // Form State for New/Edit Goal
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newIcon, setNewIcon] = useState("Target");
  const [newDueDate, setNewDueDate] = useState<string>("");

  const handleAddGoal = async () => {
    if (!newName || !newTarget) return;
    startTransition(async () => {
      try {
        await addSavingGoal({
          name: newName,
          targetAmount: parseInt(newTarget.replace(/\./g, "")),
          iconName: newIcon,
          color: "#10b981",
          dueDate: newDueDate || null,
        });
        toast.success("Target tabungan berhasil dibuat!", {
          description: "Mari mulai menabung untuk impianmu.",
        });
        setIsAddOpen(false);
        resetForm();
      } catch (error) {
        toast.error("Gagal membuat target");
      }
    });
  };

  const handleEditGoal = async () => {
    if (!selectedGoal || !newName || !newTarget) return;
    startTransition(async () => {
      try {
        await updateSavingGoal(selectedGoal.id, {
          name: newName,
          targetAmount: parseInt(newTarget.replace(/\./g, "")),
          iconName: newIcon,
          dueDate: newDueDate || null,
        });
        toast.success("Target berhasil diperbarui!");
        setIsEditOpen(false);
        resetForm();
      } catch (error) {
        toast.error("Gagal memperbarui target");
      }
    });
  };

  const resetForm = () => {
    setNewName("");
    setNewTarget("");
    setNewIcon("Target");
    setNewDueDate("");
    setSelectedGoal(null);
  };

  const formatCurrencyInput = (value: string) => {
    const number = value.replace(/\D/g, "");
    return number ? parseInt(number).toLocaleString("id-ID") : "";
  };

  const handleContribute = async () => {
    if (!selectedGoal || !contributionAmount) return;
    const rawAmount = parseInt(contributionAmount.replace(/\./g, ""));

    // 1. Optimistic Update
    addOptimisticAction({
      type: "contribute",
      id: selectedGoal.id,
      amount: rawAmount,
    });
    setIsContributeOpen(false);

    // 2. Real Action
    startTransition(async () => {
      try {
        await addSavingContribution(selectedGoal.id, rawAmount);
        toast.success(
          `Berhasil menabung Rp ${rawAmount.toLocaleString("id-ID")}`,
          {
            description: `Progres untuk ${selectedGoal.name} telah diperbarui.`,
          },
        );
        setContributionAmount("");
      } catch (error) {
        toast.error("Gagal menambahkan tabungan. Mencoba memulihkan...");
      }
    });
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;

    // 1. Optimistic Update
    addOptimisticAction({ type: "delete", id: selectedGoal.id });
    setIsDeleteOpen(false);

    // 2. Real Action
    startTransition(async () => {
      try {
        await deleteSavingGoal(selectedGoal.id);
        toast.success("Target dihapus");
        resetForm();
      } catch (error) {
        toast.error("Gagal menghapus target. Mencoba memulihkan...");
      }
    });
  };

  const totalTarget = optimisticGoals.reduce(
    (acc, g) => acc + (g.targetAmount || 0),
    0,
  );
  const totalSaved = optimisticGoals.reduce(
    (acc, g) => acc + (g.currentAmount || 0),
    0,
  );
  const overallProgress =
    totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md md:col-span-2 overflow-hidden relative group">
          <div className="absolute -right-20 -top-20 size-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
              <TrendingUp className="size-4" />
              Total Progres Tabungan
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 flex-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Total Terkumpul</p>
                  <p className="text-4xl font-black font-mono tracking-tighter">
                    Rp {totalSaved.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium italic">
                    Dari target Rp {totalTarget.toLocaleString("id-ID")}
                  </p>
                </div>
                
                {totalTarget > totalSaved && (
                  <div className="space-y-1 border-l border-white/5 pl-8 hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">Sisa Target</p>
                    <p className="text-2xl font-black font-mono text-rose-500/80">
                      -Rp {(totalTarget - totalSaved).toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Butuh {Math.ceil((100 - overallProgress) / 10)}% tenaga lagi!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={cn(
                    "font-black px-4 py-2 rounded-xl shadow-lg transition-all",
                    overallProgress >= 100
                      ? "bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400/30"
                      : "bg-primary/20 text-primary border border-primary/30",
                  )}
                >
                  {overallProgress >= 100
                    ? `${overallProgress.toFixed(1)}% Terlampaui 🎉`
                    : `${overallProgress.toFixed(1)}% Tercapai`}
                </Badge>
                {overallProgress < 100 && (
                   <span className="text-[9px] font-black text-primary/40 uppercase tracking-tighter">Hampir Separuh!</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Progress
                value={Math.min(overallProgress, 100)}
                className="h-3 bg-emerald-500/10"
                indicatorClassName={cn(
                  overallProgress >= 100
                    ? "bg-emerald-500 shadow-[0_0_12px_2px_rgba(16,185,129,0.4)]"
                    : "bg-primary",
                )}
              />
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground/60 px-0.5">
                <span>{formatCurrency(0, currency)}</span>
                <span>Target: {formatCurrency(totalTarget, currency)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="size-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
            <Target className="size-8" />
          </div>
          <div>
            <p className="font-black text-lg">Mulai Impian Baru</p>
            <p className="text-xs text-muted-foreground max-w-[180px] mt-1 font-medium">
              Tetapkan target dan disiplin menabung setiap hari.
            </p>
          </div>
          <Sheet 
            open={isAddOpen} 
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) resetForm();
            }}
          >
            <SheetTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsAddOpen(true);
                }}
                className="w-full rounded-2xl bg-primary hover:bg-primary/90 font-black shadow-lg shadow-primary/20"
              >
                <Plus className="size-4 mr-2" />
                Tambah Target
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden p-0 gap-0 focus:outline-none flex flex-col"
            >
              <SheetHeader className="px-8 pt-8 pb-6 border-b border-white/5 shrink-0">
                <SheetTitle className="text-2xl font-black">
                  Buat Target Baru
                </SheetTitle>
                <SheetDescription className="font-medium text-muted-foreground">
                  Apa impian besar yang ingin Anda wujudkan selanjutnya?
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                    Nama Impian
                  </Label>
                  <Input
                    placeholder="Contoh: Dana Darurat, Liburan Jepang"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl bg-muted/10 border-white/10 h-12 font-bold focus-visible:ring-primary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                    Target Nominal ({currency})
                  </Label>
                  <InputGroup className="bg-muted/10 border-white/10 rounded-xl h-12 focus-within:ring-primary/30 overflow-hidden">
                    <InputGroupAddon className="pl-4">
                      <span
                        className={cn(
                          "text-muted-foreground/40 font-black transition-all duration-300",
                          newTarget.length > 12 ? "text-[10px]" : "text-sm",
                        )}
                      >
                        {currency === "USD" ? "$" : "Rp"}
                      </span>
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="10.000.000"
                      value={newTarget}
                      onChange={(e) =>
                        setNewTarget(formatCurrencyInput(e.target.value))
                      }
                      maxLength={20}
                      className={cn(
                        "font-mono font-black transition-all duration-300",
                        newTarget.length <= 10 ? "text-base" : "text-xs",
                      )}
                    />
                  </InputGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                    Batas Waktu (Opsional)
                  </Label>
                  <DatePicker
                    value={newDueDate}
                    onChange={(val) => setNewDueDate(val)}
                    placeholder="Pilih tanggal target"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                    Pilih Ikon
                  </Label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.keys(ICON_MAP).map((icon) => {
                      const IconComp = ICON_MAP[icon];
                      const isActive = newIcon === icon;
                      return (
                        <button
                          key={icon}
                          type="button"
                          className={cn(
                            "size-14 rounded-2xl flex items-center justify-center transition-all duration-200 border",
                            isActive
                              ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/30 scale-110 ring-2 ring-primary/30 ring-offset-1 ring-offset-background"
                              : "bg-muted/10 border-white/5 text-muted-foreground/60 hover:border-white/20 hover:text-white hover:bg-muted/20",
                          )}
                          onClick={() => setNewIcon(icon)}
                        >
                          <IconComp className="size-6" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <SheetFooter className="px-8 py-4 border-t border-white/5 shrink-0">
                <Button
                  onClick={handleAddGoal}
                  disabled={isPending || !newName || !newTarget}
                  className="w-full rounded-2xl h-14 bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 disabled:opacity-40"
                >
                  {isPending ? "Memproses..." : "Pasang Target! 🎯"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {optimisticGoals.length > 0 ? (
          optimisticGoals.map((goal) => {
            const current = goal.currentAmount || 0;
            const progress = (current / goal.targetAmount) * 100;
            const Icon = ICON_MAP[goal.iconName || "Target"] || Target;

            return (
              <Card
                key={goal.id}
                className="border-border/40 bg-card/30 backdrop-blur-md group hover:border-primary/30 transition-all duration-300 overflow-hidden relative"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4",
                      )}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="flex gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-lg text-muted-foreground/50 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 bg-background/80 backdrop-blur-2xl border-white/10 rounded-xl p-1.5 shadow-2xl"
                        >
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">
                            Opsi Target
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedGoal(goal);
                              setNewName(goal.name);
                              setNewTarget(
                                formatCurrencyInput(
                                  goal.targetAmount.toString(),
                                ),
                              );
                              setNewIcon(goal.iconName || "Target");
                              setNewDueDate(goal.dueDate || "");
                              setIsEditOpen(true);
                            }}
                            className="rounded-lg text-xs font-bold py-2 gap-2 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                          >
                            <Pencil className="size-3.5" />
                            Ubah
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedGoal(goal);
                              setIsDeleteOpen(true);
                            }}
                            className="rounded-lg text-xs font-bold py-2 gap-2 focus:bg-rose-500/10 focus:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-black group-hover:text-primary transition-colors">
                    {goal.name}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5">
                    <CardDescription className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-muted-foreground/80">
                      <Calendar className="size-3 text-primary/60" />
                      {goal.dueDate ? (
                        format(new Date(goal.dueDate), "dd MMM yyyy", {
                          locale: id,
                        })
                      ) : (
                        "Tanpa Batas Waktu"
                      )}
                    </CardDescription>

                    {goal.dueDate && (
                      <div
                        className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight flex items-center gap-1",
                          (() => {
                            const daysLeft = differenceInDays(
                              new Date(goal.dueDate),
                              startOfToday(),
                            );
                            if (daysLeft > 7)
                              return "bg-primary/10 text-primary border border-primary/20";
                            if (daysLeft >= 0)
                              return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                            return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
                          })(),
                        )}
                      >
                        {(() => {
                          const daysLeft = differenceInDays(
                            new Date(goal.dueDate),
                            startOfToday(),
                          );
                          if (daysLeft > 0) return `${daysLeft} Hari Lagi`;
                          if (daysLeft === 0) return "Hari Terakhir!";
                          return `Terlewat ${Math.abs(daysLeft)} Hari`;
                        })()}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                        Terkumpul
                      </p>
                      <p className="text-xl font-black font-mono">
                        Rp {current.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      {current >= goal.targetAmount ? (
                        <>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">
                            Terlampaui
                          </p>
                          <p className="text-sm font-bold text-emerald-500 italic">
                            +Rp{" "}
                            {(current - goal.targetAmount).toLocaleString(
                              "id-ID",
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                            Sisa
                          </p>
                          <p className="text-sm font-bold text-rose-500/80 italic">
                            Rp{" "}
                            {(goal.targetAmount - current).toLocaleString(
                              "id-ID",
                            )}{" "}
                            lagi
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span
                        className={
                          progress >= 100 ? "text-emerald-500" : "text-primary"
                        }
                      >
                        {Math.min(progress, 999).toFixed(0)}%{" "}
                        {progress >= 100 ? "Selesai 🎉" : "Tercapai"}
                      </span>
                      <span className="text-muted-foreground opacity-40">
                        Target: {formatCurrency(goal.targetAmount, currency)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(progress, 100)}
                      className="h-2 bg-muted/20"
                      indicatorClassName={cn(
                        progress >= 100
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          : "bg-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]",
                      )}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setIsContributeOpen(true);
                    }}
                    className="w-full rounded-2xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/5 font-black uppercase tracking-widest text-[10px] h-12 transition-all active:scale-95"
                  >
                    <Wallet className="size-4 mr-2" />
                    Tambah Tabungan
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-20 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center">
            <EmptyState
              icon={Target}
              title="Belum Ada Target"
              description="Wujudkan impianmu dengan mulai menetapkan target tabungan hari ini."
            />
            <Button
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              variant="outline"
              className="rounded-xl border-primary/30 text-primary font-bold mt-2"
            >
              Buat Target Pertama
            </Button>
          </div>
        )}
      </div>

      <Sheet 
        open={isEditOpen} 
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) resetForm();
        }}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden p-0 gap-0 focus:outline-none flex flex-col"
        >
          <SheetHeader className="px-8 pt-8 pb-6 border-b border-white/5 shrink-0">
            <SheetTitle className="text-2xl font-black">Edit Target</SheetTitle>
            <SheetDescription className="font-medium text-muted-foreground">
              Sesuaikan target impian Anda.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Nama Impian
              </Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="rounded-xl bg-muted/10 border-white/10 h-12 font-bold focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Target Nominal ({currency})
              </Label>
              <InputGroup className="bg-muted/10 border-white/10 rounded-xl h-12 focus-within:ring-primary/30 overflow-hidden">
                <InputGroupAddon className="pl-4">
                  <span
                    className={cn(
                      "text-muted-foreground/40 font-black transition-all duration-300",
                      newTarget.length > 12 ? "text-[10px]" : "text-sm",
                    )}
                  >
                    {currency === "USD" ? "$" : "Rp"}
                  </span>
                </InputGroupAddon>
                <InputGroupInput
                  value={newTarget}
                  onChange={(e) =>
                    setNewTarget(formatCurrencyInput(e.target.value))
                  }
                  maxLength={20}
                  className={cn(
                    "font-mono font-black transition-all duration-300",
                    newTarget.length <= 10 ? "text-base" : "text-xs",
                  )}
                />
              </InputGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Ubah Batas Waktu (Opsional)
              </Label>
              <DatePicker
                value={newDueDate}
                onChange={(val) => setNewDueDate(val)}
                placeholder="Pilih tanggal target"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Ubah Ikon
              </Label>
              <div className="grid grid-cols-5 gap-3">
                {Object.keys(ICON_MAP).map((icon) => {
                  const IconComp = ICON_MAP[icon];
                  const isActive = newIcon === icon;
                  return (
                    <button
                      key={icon}
                      type="button"
                      className={cn(
                        "size-14 rounded-2xl flex items-center justify-center transition-all duration-200 border",
                        isActive
                          ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/30 scale-110 ring-2 ring-primary/30 ring-offset-1 ring-offset-background"
                          : "bg-muted/10 border-white/5 text-muted-foreground/60 hover:border-white/20 hover:text-white hover:bg-muted/20",
                      )}
                      onClick={() => setNewIcon(icon)}
                    >
                      <IconComp className="size-6" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <SheetFooter className="px-8 py-4 border-t border-white/5 shrink-0">
            <Button
              onClick={handleEditGoal}
              disabled={isPending || !newName || !newTarget}
              className="w-full rounded-2xl h-14 bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 disabled:opacity-40"
            >
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Premium Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-background/40 backdrop-blur-3xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-0 sm:max-w-[400px]">
          <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-rose-500/10 to-transparent pointer-events-none" />
          <div className="p-8 pt-10 flex flex-col items-center text-center space-y-4">
            <div className="size-16 rounded-3xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
              <AlertTriangle className="size-8" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Hapus Target?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-medium">
                Tindakan ini akan menghapus target impian Anda. Riwayat tabungan
                untuk target ini tetap akan tercatat di transaksi.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter className="p-8 pt-0 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5 bg-transparent m-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 m-0"
            >
              {isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contribution Sheet */}
      <Sheet open={isContributeOpen} onOpenChange={setIsContributeOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden p-0 gap-0 focus:outline-none flex flex-col"
        >
          <SheetHeader className="px-8 pt-8 pb-6 border-b border-white/5 shrink-0">
            <SheetTitle className="text-2xl font-black">
              Nabung buat {selectedGoal?.name}
            </SheetTitle>
            <SheetDescription className="font-medium text-muted-foreground">
              Berapa banyak yang ingin Anda sisihkan hari ini?
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Progress preview if goal exists */}
            {selectedGoal && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Progres saat ini</span>
                  <span className="text-emerald-500">
                    {formatCurrency(selectedGoal.currentAmount || 0, currency)} / {formatCurrency(selectedGoal.targetAmount, currency)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-emerald-500/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(((selectedGoal.currentAmount || 0) / selectedGoal.targetAmount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Nominal Tabungan ({currency})
              </Label>
              <InputGroup className="bg-muted/10 border-white/10 rounded-xl h-16 focus-within:ring-emerald-500/30 overflow-hidden">
                <InputGroupAddon className="pl-4">
                  <span
                    className={cn(
                      "font-black text-muted-foreground/40 transition-all duration-300",
                      contributionAmount.length > 12 ? "text-xs" : "text-sm",
                    )}
                  >
                    {currency === "USD" ? "$" : "Rp"}
                  </span>
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="0"
                  autoFocus
                  value={contributionAmount}
                  onChange={(e) =>
                    setContributionAmount(formatCurrencyInput(e.target.value))
                  }
                  maxLength={20}
                  className={cn(
                    "font-mono font-black transition-all duration-300",
                    contributionAmount.length <= 8
                      ? "text-2xl"
                      : contributionAmount.length <= 12
                        ? "text-xl"
                        : "text-sm",
                  )}
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Jumlah Cepat
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[50000, 100000, 500000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setContributionAmount(amount.toLocaleString("id-ID"))
                    }
                    className={cn(
                      "h-12 rounded-xl border font-bold text-sm transition-all duration-200",
                      contributionAmount === amount.toLocaleString("id-ID")
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "bg-muted/10 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white",
                    )}
                  >
                    +{(amount / 1000).toLocaleString("id-ID")}k
                  </button>
                ))}
              </div>
            </div>
          </div>
          <SheetFooter className="px-8 py-4 border-t border-white/5 shrink-0">
            <Button
              onClick={handleContribute}
              disabled={isPending || !contributionAmount}
              className="w-full rounded-2xl h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 disabled:opacity-40 transition-all"
            >
              {isPending ? "Memproses..." : "Konfirmasi Tabungan"}
              <ArrowUpRight className="ml-2 size-5" />
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
