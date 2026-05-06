"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  PlusCircle,
  ShoppingBag,
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
import { PRESET_COLORS, ICON_MAP, AVAILABLE_ICONS } from "@/lib/constants";
import { Category, CategoryManagerProps } from "@/types";

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
    priority: "Kebutuhan" as "Kebutuhan" | "Keinginan",
  });

  const isLightColor = (color: string): boolean => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.type === activeTab &&
      c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Load draft from sessionStorage
  useEffect(() => {
    const savedDraft = sessionStorage.getItem("sakuku_category_draft");
    if (savedDraft && !editingCategory) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((p) => ({ ...p, ...parsed }));
        // If there's a draft name, and it's not open, we might not want to open it automatically,
        // but the state will be there when they click "Tambah".
      } catch (e) {
        console.error("Failed to load category draft", e);
      }
    }
  }, [editingCategory]);

  // Save draft to sessionStorage
  useEffect(() => {
    if (
      !editingCategory &&
      (formData.name || formData.icon !== "ShoppingBag")
    ) {
      sessionStorage.setItem("sakuku_category_draft", JSON.stringify(formData));
    }
  }, [formData, editingCategory]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: activeTab,
      color: activeTab === "expense" ? "#ef4444" : "#10b981",
      icon: "ShoppingBag",
      priority: "Kebutuhan",
    });
    setEditingCategory(null);
    sessionStorage.removeItem("sakuku_category_draft");
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Nama kategori harus diisi!");
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        priority: formData.type === "expense" ? formData.priority : undefined,
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, dataToSave);
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await addCategory(dataToSave);
        toast.success("Kategori baru berhasil ditambahkan!");
        sessionStorage.removeItem("sakuku_category_draft");
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
      priority: ["Kebutuhan", "Keinginan"].includes(cat.priority)
        ? cat.priority
        : "Kebutuhan",
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
            <Button className="font-bold rounded-xl shadow-lg transition-all hover:scale-105 bg-gradient-premium text-primary-foreground shadow-primary/20">
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
                  {AVAILABLE_ICONS.map(({ id: iconName, icon: Icon }) => {
                    const isSelected = formData.icon === iconName;
                    const iconColorClass = isSelected
                      ? isLightColor(formData.color)
                        ? "text-black"
                        : "text-white"
                      : "text-muted-foreground hover:bg-white/5";

                    return (
                      <button
                        key={iconName}
                        onClick={() =>
                          setFormData((p) => ({ ...p, icon: iconName }))
                        }
                        aria-label={`Pilih ikon ${iconName}`}
                        className={cn(
                          "size-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          isSelected &&
                            "shadow-lg scale-110 ring-2 ring-white/20",
                          iconColorClass,
                        )}
                        style={{
                          backgroundColor: isSelected
                            ? formData.color
                            : undefined,
                        }}
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

              {formData.type === "expense" && (
                <div className="grid gap-2">
                  <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-1">
                    Alokasi Anggaran (50/30)
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val: any) =>
                      setFormData((p) => ({ ...p, priority: val }))
                    }
                  >
                    <SelectTrigger
                      id="cat-priority"
                      className="w-full h-12 bg-background/40 border-white/10 rounded-2xl hover:bg-white/5 transition-all focus:ring-1 focus:ring-primary/50 px-4 text-sm"
                    >
                      <SelectValue placeholder="Pilih Alokasi" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/60 backdrop-blur-3xl border-white/10 rounded-2xl p-1 shadow-2xl">
                      <SelectItem
                        value="Kebutuhan"
                        className="rounded-xl focus:bg-rose-500/10 focus:text-rose-500 font-bold transition-colors cursor-pointer py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-rose-500" />
                          <span>Kebutuhan (50%)</span>
                        </div>
                      </SelectItem>
                      <SelectItem
                        value="Keinginan"
                        className="rounded-xl focus:bg-amber-500/10 focus:text-amber-500 font-bold transition-colors cursor-pointer py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-amber-500" />
                          <span>Keinginan (30%)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
                className="font-bold rounded-xl px-8 transition-all bg-gradient-premium text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
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
            <TabsList className="bg-muted/20 border border-white/5 p-1 rounded-xl w-full sm:w-auto">
              <TabsTrigger
                value="expense"
                className={cn(
                  "rounded-lg font-bold transition-all border border-transparent px-6 py-2",
                  activeTab === "expense"
                    ? "bg-background text-rose-500! shadow-2xl border-white/5"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pengeluaran
              </TabsTrigger>
              <TabsTrigger
                value="income"
                className={cn(
                  "rounded-lg font-bold transition-all border border-transparent px-6 py-2",
                  activeTab === "income"
                    ? "bg-background text-emerald-500! shadow-2xl border-white/5"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pemasukan
              </TabsTrigger>
            </TabsList>

            <div className="relative flex-1 group">
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors",
                  activeTab === "expense"
                    ? "group-focus-within:text-rose-500"
                    : "group-focus-within:text-emerald-500",
                )}
              />
              <Input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari kategori transaksi"
                className={cn(
                  "pl-10 bg-background/50 border-border/40 rounded-xl transition-all",
                  activeTab === "expense"
                    ? "focus:border-rose-500/50 focus:ring-rose-500/10"
                    : "focus:border-emerald-500/50 focus:ring-emerald-500/10",
                )}
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
                  const Icon = (cat.icon && ICON_MAP[cat.icon]) || ShoppingBag;
                  return (
                    <div
                      key={cat.id}
                      className="group flex items-center justify-between p-3 rounded-2xl bg-background/20 border border-border/40 hover:bg-background/40 transition-all hover:border-primary/20"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="size-10 rounded-xl flex items-center justify-center shadow-lg shadow-black/5"
                          style={{
                            backgroundColor: cat.color || "var(--primary)",
                            color: isLightColor(cat.color || "#ffffff")
                              ? "#000000"
                              : "#ffffff",
                          }}
                        >
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {cat.name}
                          </p>
                          {cat.type === "expense" && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] uppercase tracking-tighter font-medium py-0 h-4 border-muted-foreground/20",
                                cat.priority === "Kebutuhan" &&
                                  "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
                                cat.priority === "Keinginan" &&
                                  "text-amber-500 border-amber-500/20 bg-amber-500/5",
                              )}
                            >
                              {cat.priority === "Kebutuhan"
                                ? "Kebutuhan (50%)"
                                : "Keinginan (30%)"}
                            </Badge>
                          )}
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
