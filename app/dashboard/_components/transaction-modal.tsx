"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
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
import {
  Car,
  ShoppingBag,
  Utensils,
  Zap,
  Receipt,
  Heart,
  Smartphone,
  Home,
  Briefcase,
  GraduationCap,
  Wallet,
  TrendingDown,
  Plus,
  Coffee,
  Tag,
  Trash2,
  Pencil,
  Bus,
  Film,
  Music,
  Activity,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  addTransaction,
  updateTransaction,
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions";
import { toast } from "sonner";

const expenseCategories = [
  // Needs (50%)
  {
    name: "Makanan",
    icon: Utensils,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    priority: "Needs",
  },
  {
    name: "Transport",
    icon: Car,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    priority: "Needs",
  },
  {
    name: "Tagihan",
    icon: Receipt,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    priority: "Needs",
  },
  {
    name: "Rumah",
    icon: Home,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    priority: "Needs",
  },
  {
    name: "Kesehatan",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
    priority: "Needs",
  },
  {
    name: "Pendidikan",
    icon: GraduationCap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    priority: "Needs",
  },
  // Wants (30%)
  {
    name: "Belanja",
    icon: ShoppingBag,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    priority: "Wants",
  },
  {
    name: "Hiburan",
    icon: Zap,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    priority: "Wants",
  },
  {
    name: "Pulsa",
    icon: Smartphone,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    priority: "Wants",
  },
  {
    name: "Kerja",
    icon: Briefcase,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    priority: "Wants",
  },
];

const incomeCategories = [
  {
    name: "Gaji",
    icon: Wallet,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  { name: "Bonus", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  {
    name: "Investasi",
    icon: TrendingDown,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "Lainnya",
    icon: Plus,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
];

const IconMap: Record<string, any> = {
  Utensils,
  Coffee,
  Car,
  Bus,
  ShoppingBag,
  Zap,
  Receipt,
  Heart,
  Activity,
  Smartphone,
  Home,
  GraduationCap,
  Briefcase,
  Wallet,
  TrendingDown,
  Plus,
  Film,
  Music,
  Wrench,
  Tag,
};

const AVAILABLE_ICONS = [
  { id: "Coffee", icon: Coffee },
  { id: "Utensils", icon: Utensils },
  { id: "Car", icon: Car },
  { id: "Bus", icon: Bus },
  { id: "ShoppingBag", icon: ShoppingBag },
  { id: "Zap", icon: Zap },
  { id: "Receipt", icon: Receipt },
  { id: "Heart", icon: Heart },
  { id: "Activity", icon: Activity },
  { id: "Smartphone", icon: Smartphone },
  { id: "Home", icon: Home },
  { id: "GraduationCap", icon: GraduationCap },
  { id: "Briefcase", icon: Briefcase },
  { id: "Film", icon: Film },
  { id: "Music", icon: Music },
  { id: "Wrench", icon: Wrench },
  { id: "Wallet", icon: Wallet },
  { id: "TrendingDown", icon: TrendingDown },
  { id: "Tag", icon: Tag },
  { id: "Plus", icon: Plus },
];

interface TransactionModalProps {
  transaction?: any;
  categories?: any[];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionModal({
  transaction,
  categories: dbCategories = [],
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TransactionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedCategory, setSelectedCategory] = useState<string>("Makanan");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-CA"),
  );
  const [loading, setLoading] = useState(false);

  // Category Management State
  const [isManaging, setIsManaging] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<number | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatPriority, setNewCatPriority] = useState<"Penting" | "Sekunder">(
    "Penting",
  );
  const [newCatIcon, setNewCatIcon] = useState("Plus");

  const isEdit = !!transaction;

  useEffect(() => {
    if (transaction && open) {
      setType(transaction.type);
      setSelectedCategory(
        transaction.category?.name || transaction.categoryName || "Makanan",
      );
      setAmount(
        transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      );
      setDescription(transaction.description || "");
      setDate(
        transaction.date
          ? new Date(transaction.date).toLocaleDateString("en-CA")
          : new Date().toLocaleDateString("en-CA"),
      );
    } else if (!open && !transaction) {
      // Reset for "Add" mode when closed
      setAmount("");
      setDescription("");
      setDate(new Date().toLocaleDateString("en-CA"));
      setType("expense");
      setSelectedCategory("Makanan");
    }
  }, [transaction, open]);

  const formatNumber = (value: string) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAmount(formatted);
  };

  const handleTypeChange = (newType: "expense" | "income") => {
    setType(newType);
    setSelectedCategory(newType === "expense" ? "Makanan" : "Gaji");
  };

  const handleSave = async () => {
    if (!amount || amount === "0") {
      toast.error("Masukan jumlah transaksi", {
        description: "Jumlah tidak boleh kosong atau nol.",
      });
      return;
    }

    setLoading(true);
    try {
      const data = {
        amount: parseInt(amount.replace(/\./g, "")),
        categoryName: selectedCategory,
        type: type,
        description: description,
        date: date,
      };

      if (isEdit) {
        await updateTransaction(transaction.id, data);
        toast.success("Transaksi berhasil diperbarui!", {
          description: "Perubahan telah disimpan ke riwayat Anda.",
        });
      } else {
        await addTransaction(data);
        toast.success("Transaksi berhasil disimpan!", {
          description: "Data transaksi baru telah ditambahkan.",
        });
        setAmount("");
        setDescription("");
      }
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan transaksi", {
        description: "Terjadi kesalahan server, silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setLoading(true);
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, {
          name: newCatName,
          type: type,
          priority: type === "expense" ? (newCatPriority as any) : "Lainnya",
          icon: newCatIcon,
        });
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await addCategory({
          name: newCatName,
          type: type,
          priority: type === "expense" ? (newCatPriority as any) : "Lainnya",
          color:
            type === "expense"
              ? newCatPriority === "Penting"
                ? "text-rose-500"
                : "text-amber-500"
              : "text-emerald-500",
          icon: newCatIcon,
        });
        toast.success("Kategori baru berhasil ditambahkan!");
      }
      setNewCatName("");
      setNewCatIcon("Plus");
      setEditingCategoryId(null);
      setIsAddingCategory(false);
    } catch (error) {
      toast.error("Gagal memproses kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!catToDelete) return;
    setLoading(true);
    try {
      await deleteCategory(catToDelete);
      toast.success("Kategori berhasil dihapus");
      setIsDeleteCatOpen(false);
      setCatToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus kategori");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = (id: number) => {
    setCatToDelete(id);
    setIsDeleteCatOpen(true);
  };

  const startEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatPriority(cat.priority === "Penting" ? "Penting" : "Sekunder");
    setNewCatIcon(cat.icon || "Plus");
    setIsAddingCategory(true);
  };

  const currentCategories =
    dbCategories.length > 0
      ? dbCategories
      : type === "expense"
        ? expenseCategories
        : incomeCategories;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger: Show children trigger, default floating button (only if not controlled), or no trigger */}
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : !controlledOpen && !transaction ? (
        <SheetTrigger asChild>
          <Button className="fixed bottom-8 right-8 size-16 rounded-2xl shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 group z-50 border border-white/20">
            <Plus className="size-8 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent 
        side="right"
        className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden p-0 gap-0 focus:outline-none"
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="text-2xl font-black text-center tracking-tight">
            {isEdit ? "Ubah Transaksi" : "Catat Transaksi"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Formulir untuk {isEdit ? "mengubah" : "menambah"} data transaksi
            keuangan Anda.
          </SheetDescription>
        </SheetHeader>
        <Separator className="bg-white/5" />

        <div className="px-8 pb-8 space-y-6 relative">
          <div className="flex p-1.5 bg-muted/20 rounded-2xl border border-border/40 backdrop-blur-md">
            <button
              disabled={loading}
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                type === "expense"
                  ? "bg-background text-rose-500 shadow-xl border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pengeluaran
            </button>
            <button
              disabled={loading}
              onClick={() => handleTypeChange("income")}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300",
                type === "income"
                  ? "bg-background text-emerald-500 shadow-xl border border-border/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-3 text-center">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Jumlah Transaksi (IDR)
            </Label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground/20 group-focus-within:text-primary/40 transition-colors">
                Rp
              </span>
              <Input
                type="text"
                placeholder="0"
                autoFocus
                disabled={loading}
                value={amount}
                onChange={handleAmountChange}
                className="border-none bg-transparent text-6xl font-black text-center h-24 focus-visible:ring-0 placeholder:text-muted-foreground/5 tabular-nums caret-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Tanggal
              </Label>
              <DatePicker
                value={date}
                onChange={(val) => setDate(val)}
                disabled={loading}
                placeholder="Pilih tanggal"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Keterangan
              </Label>
              <Input
                placeholder="Catatan..."
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-muted/10 border-border/40 rounded-xl py-6 font-medium focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Pilih Kategori {type === "expense" && "(50/30/20)"}
              </Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsManaging(!isManaging)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest transition-colors",
                    isManaging
                      ? "text-amber-500"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isManaging ? "Selesai" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    setIsAddingCategory(!isAddingCategory);
                    if (!isAddingCategory) {
                      setEditingCategoryId(null);
                      setNewCatName("");
                    }
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  {isAddingCategory ? "Batal" : "+ Kategori"}
                </button>
              </div>
            </div>

            {isAddingCategory && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nama kategori..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest pl-1">
                    Pilih Ikon
                  </p>
                  <div className="grid grid-cols-8 gap-2">
                    {AVAILABLE_ICONS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setNewCatIcon(item.id)}
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center border transition-all",
                          newCatIcon === item.id
                            ? "bg-primary text-white border-primary"
                            : "bg-background border-border hover:border-primary/40",
                        )}
                      >
                        <item.icon className="size-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {type === "expense" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewCatPriority("Penting")}
                      className={cn(
                        "flex-1 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                        newCatPriority === "Penting"
                          ? "bg-rose-500 text-white border-rose-600"
                          : "bg-background border-border",
                      )}
                    >
                      Kebutuhan
                    </button>
                    <button
                      onClick={() => setNewCatPriority("Sekunder")}
                      className={cn(
                        "flex-1 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                        newCatPriority === "Sekunder"
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-background border-border",
                      )}
                    >
                      Keinginan
                    </button>
                  </div>
                )}
                <Button
                  onClick={handleCreateCategory}
                  disabled={loading || !newCatName}
                  className="w-full h-10 text-xs font-bold"
                >
                  {editingCategoryId ? "Perbarui Kategori" : "Simpan Kategori"}
                </Button>
              </div>
            )}

            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 py-2 no-scrollbar">
              {type === "expense" ? (
                <>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest pl-1">
                      Kebutuhan (50%)
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                      {currentCategories
                        .filter(
                          (c) =>
                            c.type === "expense" &&
                            (c.priority === "Penting" ||
                              c.priority === "Needs"),
                        )
                        .map((cat) => {
                          const Icon =
                            IconMap[cat.icon as string] ||
                            (cat.icon && typeof cat.icon !== "string"
                              ? cat.icon
                              : Plus);
                          const bg =
                            cat.bg ||
                            (cat.priority === "Penting" ||
                            cat.priority === "Needs"
                              ? "bg-rose-500/10"
                              : "bg-amber-500/10");
                          return (
                            <div
                              key={cat.id || cat.name}
                              className="relative group/cat"
                            >
                              <button
                                disabled={loading || isManaging}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="flex flex-col items-center gap-2 group transition-all w-full"
                              >
                                <div
                                  className={cn(
                                    "size-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-lg",
                                    selectedCategory === cat.name
                                      ? cn(
                                          "border-primary/50 shadow-primary/20",
                                          bg,
                                        )
                                      : "bg-muted/10 border-transparent hover:border-white/10",
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "size-4 transition-transform group-hover:scale-110",
                                      selectedCategory === cat.name
                                        ? cat.color
                                        : "text-muted-foreground/60",
                                    )}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    "text-[8px] font-bold truncate w-full text-center px-1",
                                    selectedCategory === cat.name
                                      ? "text-foreground"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {cat.name}
                                </span>
                              </button>
                              {isManaging && (
                                <div className="absolute -top-1 -right-1 flex gap-1 z-10 animate-in zoom-in">
                                  <button
                                    onClick={() => startEditCategory(cat)}
                                    className="size-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                  >
                                    <Pencil className="size-2.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteCategory(cat.id)
                                    }
                                    className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                  >
                                    <Trash2 className="size-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest pl-1">
                      Keinginan (30%)
                    </p>
                    <div className="grid grid-cols-5 gap-3">
                      {currentCategories
                        .filter(
                          (c) =>
                            c.type === "expense" &&
                            (c.priority === "Sekunder" ||
                              c.priority === "Wants"),
                        )
                        .map((cat) => {
                          const Icon =
                            IconMap[cat.icon as string] ||
                            (cat.icon && typeof cat.icon !== "string"
                              ? cat.icon
                              : Plus);
                          const bg = cat.bg || "bg-amber-500/10";
                          return (
                            <div
                              key={cat.id || cat.name}
                              className="relative group/cat"
                            >
                              <button
                                disabled={loading || isManaging}
                                onClick={() => setSelectedCategory(cat.name)}
                                className="flex flex-col items-center gap-2 group transition-all w-full"
                              >
                                <div
                                  className={cn(
                                    "size-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-lg",
                                    selectedCategory === cat.name
                                      ? cn(
                                          "border-primary/50 shadow-primary/20",
                                          bg,
                                        )
                                      : "bg-muted/10 border-transparent hover:border-white/10",
                                  )}
                                >
                                  <Icon
                                    className={cn(
                                      "size-4 transition-transform group-hover:scale-110",
                                      selectedCategory === cat.name
                                        ? cat.color
                                        : "text-muted-foreground/60",
                                    )}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    "text-[8px] font-bold truncate w-full text-center px-1",
                                    selectedCategory === cat.name
                                      ? "text-foreground"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {cat.name}
                                </span>
                              </button>
                              {isManaging && (
                                <div className="absolute -top-1 -right-1 flex gap-1 z-10 animate-in zoom-in">
                                  <button
                                    onClick={() => startEditCategory(cat)}
                                    className="size-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                  >
                                    <Pencil className="size-2.5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      confirmDeleteCategory(cat.id)
                                    }
                                    className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                  >
                                    <Trash2 className="size-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {currentCategories
                    .filter((c) => c.type === "income")
                    .map((cat) => {
                      const Icon =
                        IconMap[cat.icon as string] ||
                        (cat.icon && typeof cat.icon !== "string"
                          ? cat.icon
                          : Wallet);
                      const bg = cat.bg || "bg-emerald-500/10";
                      return (
                        <div
                          key={cat.id || cat.name}
                          className="relative group/cat"
                        >
                          <button
                            disabled={loading || isManaging}
                            onClick={() => setSelectedCategory(cat.name)}
                            className="flex flex-col items-center gap-2 group transition-all w-full"
                          >
                            <div
                              className={cn(
                                "size-10 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-lg",
                                selectedCategory === cat.name
                                  ? cn(
                                      "border-primary/50 shadow-primary/20",
                                      bg,
                                    )
                                  : "bg-muted/10 border-transparent hover:border-white/10",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "size-4 transition-transform group-hover:scale-110",
                                  selectedCategory === cat.name
                                    ? cat.color
                                    : "text-muted-foreground/60",
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-[8px] font-bold truncate w-full text-center px-1",
                                selectedCategory === cat.name
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {cat.name}
                            </span>
                          </button>
                          {isManaging && (
                            <div className="absolute -top-1 -right-1 flex gap-1 z-10 animate-in zoom-in">
                              <button
                                onClick={() => startEditCategory(cat)}
                                className="size-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                              >
                                <Pencil className="size-2.5" />
                              </button>
                              <button
                                onClick={() => confirmDeleteCategory(cat.id)}
                                className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                              >
                                <Trash2 className="size-2.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              disabled={loading}
              onClick={handleSave}
              className={cn(
                "w-full py-8 rounded-[24px] font-black text-xl shadow-2xl transition-all active:scale-[0.97] border border-white/10",
                isEdit
                  ? "bg-primary hover:bg-primary/90 shadow-primary/20"
                  : type === "expense"
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                    : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
              )}
            >
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Perbarui"
                  : `Simpan ${type === "expense" ? "Pengeluaran" : "Pemasukan"}`}
            </Button>

            {/* Category Delete Confirmation */}
            <AlertDialog
              open={isDeleteCatOpen}
              onOpenChange={setIsDeleteCatOpen}
            >
              <AlertDialogContent className="bg-background/40 backdrop-blur-3xl border-white/10 rounded-[32px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-black">
                    Hapus Kategori?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground font-medium">
                    Tindakan ini tidak dapat dibatalkan. Kategori hanya bisa
                    dihapus jika tidak memiliki riwayat transaksi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteCategory}
                    disabled={loading}
                    className="rounded-xl bg-[#f43f5e]! !hover:bg-[#e11d48] text-white! font-black shadow-lg shadow-rose-500/20 border-none disabled:opacity-50"
                  >
                    <Trash2 className="size-4 mr-2" />
                    {loading ? "Menghapus..." : "Ya, Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-center text-[10px] text-muted-foreground mt-4 font-medium italic opacity-60">
              Transaksi akan otomatis diperbarui ke dashboard Anda
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Keep export for backward compatibility or direct use
export const AddTransactionModal = TransactionModal;
