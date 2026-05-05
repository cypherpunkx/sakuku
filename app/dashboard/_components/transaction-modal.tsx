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
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ICON_MAP,
  AVAILABLE_ICONS,
} from "@/lib/constants";

// Helper to get the correct icon component based on database value or keyword matching
const getCategoryIcon = (cat: any) => {
  // 1. Smart fallback based on keywords in the name (HIGHEST PRIORITY)
  // This ensures categories like "Bonus" get the Zap icon even if the DB says "Wallet"
  const name = (cat.name || "").trim().toLowerCase();

  // Income keywords
  if (
    name.includes("bonus") ||
    name.includes("hadiah") ||
    name.includes("hibur") ||
    name.includes("extra")
  )
    return ICON_MAP["Zap"];
  if (
    name.includes("invest") ||
    name.includes("untung") ||
    name.includes("trading") ||
    name.includes("saham")
  )
    return ICON_MAP["TrendingDown"];
  if (
    name.includes("gaji") ||
    name.includes("salary") ||
    name.includes("utama")
  )
    return ICON_MAP["Wallet"];

  // Expense keywords
  if (
    name.includes("makan") ||
    name.includes("minum") ||
    name.includes("food") ||
    name.includes("kuliner")
  )
    return ICON_MAP["Utensils"];
  if (
    name.includes("transport") ||
    name.includes("bensin") ||
    name.includes("ojek") ||
    name.includes("car") ||
    name.includes("kendaraan")
  )
    return ICON_MAP["Car"];
  if (
    name.includes("listrik") ||
    name.includes("air") ||
    name.includes("tagihan") ||
    name.includes("utility") ||
    name.includes("billing")
  )
    return ICON_MAP["Zap"];
  if (
    name.includes("belanja") ||
    name.includes("shop") ||
    name.includes("beli") ||
    name.includes("mall")
  )
    return ICON_MAP["ShoppingBag"];
  if (
    name.includes("hibur") ||
    name.includes("film") ||
    name.includes("bioskop") ||
    name.includes("game") ||
    name.includes("nonton")
  )
    return ICON_MAP["Film"];
  if (
    name.includes("obat") ||
    name.includes("sakit") ||
    name.includes("health") ||
    name.includes("dokter") ||
    name.includes("apotek")
  )
    return ICON_MAP["Heart"];
  if (
    name.includes("rumah") ||
    name.includes("sewa") ||
    name.includes("kontrak") ||
    name.includes("home")
  )
    return ICON_MAP["Home"];
  if (
    name.includes("pulsa") ||
    name.includes("data") ||
    name.includes("hp") ||
    name.includes("telkom")
  )
    return ICON_MAP["Smartphone"];
  if (
    name.includes("kerja") ||
    name.includes("office") ||
    name.includes("bisnis")
  )
    return ICON_MAP["Briefcase"];
  if (
    name.includes("nonton") ||
    name.includes("film") ||
    name.includes("bioskop") ||
    name.includes("netflix")
  )
    return ICON_MAP["Film"];
  if (
    name.includes("musik") ||
    name.includes("music") ||
    name.includes("spotify")
  )
    return ICON_MAP["Music"];

  // 2. Try mapping from string icon name (from DB) - Lower priority than names
  if (typeof cat.icon === "string" && ICON_MAP[cat.icon]) {
    return ICON_MAP[cat.icon];
  }

  // 3. Try using the icon if it's already a component
  if (cat.icon && typeof cat.icon !== "string") {
    return cat.icon;
  }

  // 4. Final default based on type
  return cat.type === "income" ? ICON_MAP["Wallet"] : ICON_MAP["Plus"];
};

interface TransactionModalProps {
  transaction?: any;
  categories?: any[];
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  currency?: string;
}

export function TransactionModal({
  transaction,
  categories: dbCategories = [],
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  currency = "IDR",
}: TransactionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

  const [type, setType] = useState<"expense" | "income">("expense");
  const [selectedCategory, setSelectedCategory] = useState<string>("Makanan");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [store, setStore] = useState<string>("");
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
  const [newCatPriority, setNewCatPriority] = useState<
    "Kebutuhan" | "Keinginan"
  >("Kebutuhan");
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
      setStore(transaction.store || "");
      setDate(
        transaction.date
          ? new Date(transaction.date).toLocaleDateString("en-CA")
          : new Date().toLocaleDateString("en-CA"),
      );
    } else if (!open && !transaction) {
      // Reset for "Add" mode when closed
      setAmount("");
      setDescription("");
      setStore("");
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
        store: store,
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
              ? newCatPriority === "Kebutuhan"
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

  const startAddCategory = () => {
    setEditingCategoryId(null);
    setNewCatName("");
    setNewCatPriority("Kebutuhan");
    setNewCatIcon("Plus");
    setIsAddingCategory(true);
  };

  const startEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatPriority(cat.priority === "Kebutuhan" ? "Kebutuhan" : "Keinginan");
    setNewCatIcon(cat.icon || "Plus");
    setIsAddingCategory(true);
  };

  const currentCategories = dbCategories.filter((c) => c.type === type);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger: Show children trigger, default floating button (only if not controlled), or no trigger */}
      {children ? (
        <SheetTrigger asChild>{children}</SheetTrigger>
      ) : !controlledOpen && !transaction ? (
        <SheetTrigger asChild>
          <Button 
            aria-label="Catat transaksi baru"
            className="fixed bottom-8 right-8 size-16 rounded-2xl shadow-2xl shadow-primary/40 bg-primary hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 group z-50 border border-white/20"
          >
            <Plus className="size-8 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </SheetTrigger>
      ) : null}

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl p-0 flex flex-col focus:outline-none"
      >
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

        <SheetHeader className="p-8 pb-4 shrink-0">
          <SheetTitle className="text-2xl font-black text-center tracking-tight">
            {isEdit ? "Ubah Transaksi" : "Catat Transaksi"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Formulir untuk {isEdit ? "mengubah" : "menambah"} data transaksi
            keuangan Anda.
          </SheetDescription>
        </SheetHeader>
        <Separator className="bg-white/5" />

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-8 pb-10 pt-4 space-y-8 relative">
            <div className="grid grid-cols-2 p-1.5 bg-muted/20 rounded-2xl border border-border/40 backdrop-blur-md relative overflow-hidden group/mode">
              {/* Sliding Background Indicator */}
              <div
                className={cn(
                  "absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-out shadow-2xl border border-border/50 bg-background z-0",
                  type === "expense" ? "left-1.5" : "left-[calc(50%+3px)]",
                )}
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => handleTypeChange("expense")}
                className={cn(
                  "py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10",
                  type === "expense"
                    ? "text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleTypeChange("income")}
                className={cn(
                  "py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10",
                  type === "income"
                    ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pemasukan
              </button>
            </div>

            <div className="space-y-4 text-center">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">
                Jumlah Transaksi ({currency})
              </Label>
              <div className="flex items-center justify-center gap-3 h-24 px-4 overflow-hidden group/amount">
                <span
                  className={cn(
                    "font-black transition-all duration-300 shrink-0",
                    amount.length > 12 ? "text-xl" : "text-3xl",
                    amount
                      ? type === "expense"
                        ? "text-rose-500/40"
                        : "text-emerald-500/40"
                      : "text-muted-foreground/20 group-focus-within:text-primary/40",
                  )}
                >
                  {currency === "IDR"
                    ? "Rp"
                    : currency === "USD"
                      ? "$"
                      : currency}
                </span>
                <input
                  type="text"
                  placeholder="0"
                  autoFocus
                  disabled={loading}
                  value={amount}
                  onChange={handleAmountChange}
                  maxLength={20}
                  className={cn(
                    "bg-transparent border-none outline-none font-black tabular-nums caret-primary transition-all duration-500 min-w-0 flex-1",
                    amount.length <= 8
                      ? "text-6xl"
                      : amount.length <= 12
                        ? "text-4xl"
                        : amount.length <= 16
                          ? "text-2xl"
                          : "text-xl",
                    amount.length > 8 ? "text-left" : "text-center",
                    // Dynamic Glow Effect
                    amount &&
                      type === "expense" &&
                      "text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]",
                    amount &&
                      type === "income" &&
                      "text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]",
                  )}
                  style={{ width: amount.length > 8 ? "100%" : "auto" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">
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
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">
                  Toko / Lokasi
                </Label>
                <Input
                  placeholder="Indomaret, Netflix, dll..."
                  disabled={loading}
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="bg-muted/10 border-border/40 rounded-xl py-6 font-medium focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">
                Keterangan
              </Label>
              <Input
                placeholder="Catatan tambahan..."
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-muted/10 border-border/40 rounded-xl py-6 font-medium focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/90">
                  Pilih Kategori {type === "expense" && "(50/30/20)"}
                </Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsManaging(!isManaging)}
                    aria-label={isManaging ? "Selesai mengelola kategori" : "Kelola kategori"}
                    className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all duration-300",
                      isManaging
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "bg-muted/10 border-white/5 text-muted-foreground/90 hover:text-foreground hover:bg-muted/20 hover:border-white/10",
                    )}
                  >
                    {isManaging ? "Selesai" : "Edit"}
                  </button>
                  <button
                    onClick={() => {
                      if (isAddingCategory) {
                        setIsAddingCategory(false);
                        setEditingCategoryId(null);
                        setNewCatName("");
                      } else {
                        startAddCategory();
                      }
                    }}
                    aria-label={isAddingCategory ? "Batal tambah kategori" : "Tambah kategori baru"}
                    className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all duration-300 flex items-center gap-1.5 active:scale-95",
                      isAddingCategory
                        ? "bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                        : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.1)]",
                    )}
                  >
                    {isAddingCategory ? (
                      "Batal"
                    ) : (
                      <>
                        <Plus className="size-3" />
                        Kategori
                      </>
                    )}
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
                    <p className="text-[9px] font-black text-muted-foreground/90 uppercase tracking-widest pl-1">
                      Pilih Ikon
                    </p>
                    <div className="grid grid-cols-8 gap-2">
                      {AVAILABLE_ICONS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setNewCatIcon(item.id)}
                          aria-label={`Pilih ikon ${item.id}`}
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
                        onClick={() => setNewCatPriority("Kebutuhan")}
                        aria-pressed={newCatPriority === "Kebutuhan"}
                        className={cn(
                          "flex-1 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                          newCatPriority === "Kebutuhan"
                            ? "bg-rose-500 text-white border-rose-600"
                            : "bg-background border-border",
                        )}
                      >
                        Kebutuhan
                      </button>
                      <button
                        onClick={() => setNewCatPriority("Keinginan")}
                        aria-pressed={newCatPriority === "Keinginan"}
                        className={cn(
                          "flex-1 py-2 text-[9px] font-black uppercase rounded-lg border transition-all",
                          newCatPriority === "Keinginan"
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
                    {editingCategoryId
                      ? "Perbarui Kategori"
                      : "Simpan Kategori"}
                  </Button>
                </div>
              )}

              <div className="space-y-8">
                {type === "expense" ? (
                  <>
                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-rose-500/60 uppercase tracking-widest pl-1">
                        Kebutuhan (50%)
                      </p>
                      <div className="grid grid-cols-4 gap-4">
                        {currentCategories
                          .filter(
                            (c) =>
                              c.type === "expense" &&
                              c.priority === "Kebutuhan",
                          )
                          .map((cat) => {
                            const Icon = getCategoryIcon(cat);
                            const bg =
                              cat.bg ||
                              (cat.priority === "Kebutuhan"
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
                                          : "text-muted-foreground/90",
                                      )}
                                    />
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold truncate w-full text-center px-1 transition-colors",
                                      selectedCategory === cat.name
                                        ? "opacity-100"
                                        : "text-muted-foreground",
                                    )}
                                    style={{ color: selectedCategory === cat.name ? cat.color : undefined }}
                                  >
                                    {cat.name}
                                  </span>
                                </button>
                                {isManaging && (
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 animate-in zoom-in">
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
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <p className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest pl-1">
                        Keinginan (30%)
                      </p>
                      <div className="grid grid-cols-4 gap-4">
                        {currentCategories
                          .filter(
                            (c) =>
                              c.type === "expense" &&
                              c.priority === "Keinginan",
                          )
                          .map((cat) => {
                            const Icon = getCategoryIcon(cat);
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
                                          : "text-muted-foreground/90",
                                      )}
                                    />
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[10px] font-bold truncate w-full text-center px-1 transition-colors",
                                      selectedCategory === cat.name
                                        ? "opacity-100"
                                        : "text-muted-foreground",
                                    )}
                                    style={{ color: selectedCategory === cat.name ? cat.color : undefined }}
                                  >
                                    {cat.name}
                                  </span>
                                </button>
                                {isManaging && (
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 animate-in zoom-in">
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
                  <div className="grid grid-cols-4 gap-4">
                    {currentCategories
                      .filter((c) => c.type === "income")
                      .map((cat) => {
                        const Icon = getCategoryIcon(cat);
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
                                      : "text-muted-foreground/90",
                                  )}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-[10px] font-bold truncate w-full text-center px-1",
                                  selectedCategory === cat.name
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              >
                                {cat.name}
                              </span>
                            </button>
                            {isManaging && (
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 animate-in zoom-in">
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

              <div className="pt-6 pb-4">
                <Button
                  disabled={loading || !amount || amount === "0"}
                  onClick={handleSave}
                  className={cn(
                    "w-full py-6 rounded-[24px] font-black text-lg shadow-2xl transition-all active:scale-[0.97] border border-white/10 relative overflow-hidden group/btn",
                    isEdit
                      ? "bg-primary hover:bg-primary/90 shadow-primary/20"
                      : type === "expense"
                        ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
                        : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30",
                    (loading || !amount || amount === "0") &&
                      "opacity-50 grayscale cursor-not-allowed",
                  )}
                >
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isEdit ? "Perbarui" : "Simpan"}{" "}
                    {type === "expense" ? "Pengeluaran" : "Pemasukan"}
                  </span>
                </Button>

                <AlertDialog
                  open={isDeleteCatOpen}
                  onOpenChange={setIsDeleteCatOpen}
                >
                  <AlertDialogContent className="bg-background/40 backdrop-blur-3xl border-white/10 rounded-[32px] shadow-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black tracking-tight">
                        Hapus Kategori?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground/80 font-medium text-sm leading-relaxed">
                        Tindakan ini tidak dapat dibatalkan. Kategori hanya bisa
                        dihapus jika tidak memiliki riwayat transaksi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:gap-3">
                      <AlertDialogCancel className="rounded-full px-6 border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground font-bold transition-all">
                        Batal
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteCategory}
                        disabled={loading}
                        className="rounded-full px-6 bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-500/30 border-none disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Trash2 className="size-4" />
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Keep export for backward compatibility or direct use
export const AddTransactionModal = TransactionModal;
