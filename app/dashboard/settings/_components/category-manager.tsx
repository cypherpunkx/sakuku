"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  ShoppingBag,
  Utensils,
  Car,
  Smartphone,
  Home,
  Heart,
  Gift,
  Briefcase,
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
  Check,
  X,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  addCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/transaction.actions";
import { cn } from "@/lib/utils";
import { PRESET_COLORS, PRIORITY_OPTIONS } from "@/lib/constants";

interface CategoryManagerProps {
  categories: any[];
}

const iconMap: Record<string, any> = {
  ShoppingBag,
  Utensils,
  Car,
  Smartphone,
  Home,
  Heart,
  Gift,
  Briefcase,
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
};

const presetIcons = Object.keys(iconMap);

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [catToDeleteId, setCatToDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "expense" | "income",
    color: "#ef4444",
    icon: "ShoppingBag",
    priority: "Lainnya" as "Kebutuhan" | "Keinginan" | "Tabungan" | "Lainnya",
  });

  const filteredCategories = categories.filter(
    (c) =>
      c.type === activeTab &&
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      name: "",
      type: activeTab,
      color: activeTab === "expense" ? "#ef4444" : "#10b981",
      icon: "ShoppingBag",
      priority: "Lainnya",
    });
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Nama kategori harus diisi!");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await addCategory(formData);
        toast.success("Kategori baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Gagal menyimpan kategori.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setCatToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!catToDeleteId) return;

    setIsDeleting(true);
    try {
      await deleteCategory(catToDeleteId);
      toast.success("Kategori berhasil dihapus!");
      setIsDeleteDialogOpen(false);
      setCatToDeleteId(null);
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus kategori.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEdit = (cat: any) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      type: cat.type,
      color: cat.color || "#ef4444",
      icon: cat.icon || "ShoppingBag",
      priority: cat.priority || "Lainnya",
    });
    setIsDialogOpen(true);
  };

  return (
    <Card className="border-border/40 bg-background/40 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">
            Manajemen Kategori
          </CardTitle>
          <CardDescription>Kelola struktur pos keuangan Anda.</CardDescription>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-premium text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <PlusCircle className="size-4 mr-2" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background/95 backdrop-blur-xl border-border/40 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </DialogTitle>
              <DialogDescription>
                Sesuaikan nama, ikon, dan warna kategori Anda.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Nama Kategori</Label>
                <Input
                  id="cat-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Misal: Kopi, Gaji, dll"
                  className="bg-background/50 border-border/40 rounded-xl"
                />
              </div>

              <div className="grid gap-3">
                <Label>Pilih Ikon</Label>
                <div className="grid grid-cols-6 gap-2 p-2 rounded-xl bg-background/50 border border-border/40">
                  {presetIcons.map((iconName) => {
                    const Icon = iconMap[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() =>
                          setFormData((p) => ({ ...p, icon: iconName }))
                        }
                        aria-label={`Pilih ikon ${iconName}`}
                        className={cn(
                          "size-10 rounded-lg flex items-center justify-center transition-all",
                          formData.icon === iconName
                            ? "bg-primary text-primary-foreground shadow-lg scale-110"
                            : "hover:bg-primary/10 text-muted-foreground",
                        )}
                      >
                        <Icon className="size-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3">
                <Label>Warna Aksen</Label>
                <div className="flex flex-wrap gap-3 p-2 rounded-xl bg-background/50 border border-border/40">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData((p) => ({ ...p, color }))}
                      aria-label={`Pilih warna aksen ${color}`}
                      className={cn(
                        "size-8 rounded-full border-2 transition-all",
                        formData.color === color
                          ? "border-foreground scale-110"
                          : "border-transparent",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cat-priority">
                  Alokasi Anggaran (50/30/20)
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(val: any) =>
                    setFormData((p) => ({ ...p, priority: val }))
                  }
                >
                  <SelectTrigger
                    id="cat-priority"
                    className="h-11 bg-background/50 border-border/40 rounded-xl"
                  >
                    <SelectValue placeholder="Pilih Alokasi" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-xl">
                    <SelectItem
                      value="Kebutuhan"
                      className="focus:bg-primary/10 rounded-lg"
                    >
                      Kebutuhan (50%)
                    </SelectItem>
                    <SelectItem
                      value="Keinginan"
                      className="focus:bg-primary/10 rounded-lg"
                    >
                      Keinginan (30%)
                    </SelectItem>
                    <SelectItem
                      value="Tabungan"
                      className="focus:bg-primary/10 rounded-lg"
                    >
                      Tabungan & Investasi (20%)
                    </SelectItem>
                    <SelectItem
                      value="Lainnya"
                      className="focus:bg-primary/10 rounded-lg"
                    >
                      Lainnya
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-border/40"
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-premium text-primary-foreground font-bold rounded-xl px-8"
              >
                {editingCategory ? "Simpan Perubahan" : "Simpan Kategori"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
        <Tabs
          defaultValue="expense"
          className="w-full flex-1 flex flex-col min-h-0"
          onValueChange={(v) => {
            setActiveTab(v as any);
            setFormData((p) => ({ ...p, type: v as any }));
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <TabsList className="bg-background/50 border border-border/40 p-1 rounded-xl w-full sm:w-auto">
              <TabsTrigger
                value="expense"
                className="rounded-lg font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Pengeluaran
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className="rounded-lg font-bold data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                Pemasukan
              </TabsTrigger>
            </TabsList>

            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari kategori transaksi"
                className="pl-10 bg-background/50 border-border/40 rounded-xl focus:border-primary/50"
              />
            </div>
          </div>

          <TabsContent
            value={activeTab}
            className="flex-1 overflow-y-auto pr-2 space-y-2 mt-0"
          >
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-border/40 rounded-2xl">
                <Search className="size-8 mb-2 opacity-20" />
                <p className="text-sm font-medium">Kategori tidak ditemukan</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {filteredCategories.map((cat) => {
                  const Icon = iconMap[cat.icon] || ShoppingBag;
                  return (
                    <div
                      key={cat.id}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-background/20 border border-border/40 hover:bg-background/40 transition-all hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/5"
                          style={{ backgroundColor: cat.color || "#primary" }}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {cat.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase tracking-tighter font-medium py-0 h-4 border-muted-foreground/20",
                              cat.priority === "Kebutuhan" &&
                                "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
                              cat.priority === "Keinginan" &&
                                "text-amber-500 border-amber-500/20 bg-amber-500/5",
                              cat.priority === "Tabungan" &&
                                "text-blue-500 border-blue-500/20 bg-blue-500/5",
                              !["Kebutuhan", "Keinginan", "Tabungan"].includes(
                                cat.priority,
                              ) && "text-muted-foreground",
                            )}
                          >
                            {cat.priority === "Kebutuhan"
                              ? "Kebutuhan (50%)"
                              : cat.priority === "Keinginan"
                                ? "Keinginan (30%)"
                                : cat.priority === "Tabungan"
                                  ? "Tabungan (20%)"
                                  : cat.priority || "Lainnya"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => openEdit(cat)}
                          aria-label={`Edit kategori ${cat.name}`}
                        >
                          <Edit2 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                          onClick={() => handleDeleteClick(cat.id)}
                          aria-label={`Hapus kategori ${cat.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              Tindakan ini tidak dapat dibatalkan. Kategori hanya bisa dihapus
              jika tidak memiliki riwayat transaksi terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-3">
            <AlertDialogCancel className="rounded-xl border-border/40 font-medium">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 px-6"
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Kategori"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
