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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Inbox,
  Database,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "@/lib/utils";
import { TransactionModal } from "../transaction-modal";
import { deleteTransaction } from "@/lib/actions";
import { toast } from "sonner";
import { EmptyState } from "../empty-state";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ExpenseTabContentProps {
  dataPengeluaran: any[];
  totalPenting: number;
  totalSekunder: number;
  recentTransactions?: any[];
  categories?: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    pageSize: number;
  };
}

export function ExpenseTabContent({
  dataPengeluaran,
  totalPenting,
  totalSekunder,
  recentTransactions = [],
  categories = [],
  pagination,
}: ExpenseTabContentProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "monthly";
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync internal search state with URL when URL changes externally
  useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  const updateFilters = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Always reset to page 1 when filtering
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = (val: string) => {
    setSearchValue(val);
    // Debounce logic could be added here, or just wait for enter/blur
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  const handleCategoryChange = (catName: string) => {
    updateFilters({ category: catName });
  };

  const handleDeleteTransaction = async () => {
    if (transactionToDelete) {
      setIsDeleting(true);
      try {
        await deleteTransaction(transactionToDelete);
        toast.success("Transaksi berhasil dihapus", {
          description: "Saldo Anda telah diperbarui secara otomatis.",
        });
        setIsDeleteOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        toast.error("Gagal menghapus transaksi", {
          description: "Terjadi kesalahan saat menghapus data.",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleRowClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTransactionToDelete(id);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ... existing cards ... */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Prioritas Pengeluaran</CardTitle>
            <CardDescription>
              Berdasarkan urgensi kebutuhan bulan ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <ShieldCheck className="text-emerald-500 size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-emerald-500/90 border-emerald-500/30 backdrop-blur-xl text-white">
                      Kebutuhan Esensial
                    </TooltipContent>
                  </Tooltip>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">
                      Kebutuhan Penting
                    </p>
                    <p className="text-xl font-bold">
                      Rp {totalPenting.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
                >
                  Wajib
                </Badge>
              </div>
              <ScrollArea className="h-[120px] pr-4">
                <div className="grid gap-2">
                  {dataPengeluaran.filter((d) => d.priority === "Penting")
                    .length > 0 ? (
                    dataPengeluaran
                      .filter((d) => d.priority === "Penting")
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm px-2 py-1 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-semibold">
                            Rp {item.value.toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))
                  ) : (
                    <EmptyState title="Data Kosong" className="py-4" />
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <Zap className="text-amber-500 size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-amber-500/90 border-amber-500/30 backdrop-blur-xl text-white">
                      Keinginan & Hiburan
                    </TooltipContent>
                  </Tooltip>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">
                      Kebutuhan Sekunder
                    </p>
                    <p className="text-xl font-bold">
                      Rp {totalSekunder.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-500/20 text-amber-500 border-amber-500/30"
                >
                  Opsional
                </Badge>
              </div>
              <ScrollArea className="h-[120px] pr-4">
                <div className="grid gap-2">
                  {dataPengeluaran.filter((d) => d.priority === "Sekunder")
                    .length > 0 ? (
                    dataPengeluaran
                      .filter((d) => d.priority === "Sekunder")
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm px-2 py-1 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <span className="text-muted-foreground">
                            {item.name}
                          </span>
                          <span className="font-semibold">
                            Rp {item.value.toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))
                  ) : (
                    <EmptyState title="Data Kosong" className="py-4" />
                  )}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Chart */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-lg">Distribusi</CardTitle>
            <CardDescription>Persentase pengeluaran.</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] min-h-[240px] flex items-center justify-center relative">
            {dataPengeluaran.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <PieChart>
                  <Pie
                    data={dataPengeluaran}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPengeluaran.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(26, 26, 29, 0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="Data Kosong"
                description="Belum ada distribusi pengeluaran untuk ditampilkan."
                className="h-full"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Detailed Table */}
        <Card className="border-border/40 bg-card/30 md:col-span-2">
          <CardHeader className="flex flex-col space-y-6 pb-6">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black tracking-tight">
                Detail Transaksi
              </CardTitle>
              <CardDescription className="font-medium text-muted-foreground/85">
                Daftar lengkap belanja Anda.
              </CardDescription>
            </div>

            {/* Premium Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex-1 group"
              >
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Cari transaksi..."
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-10 text-xs bg-white/2 border-white/5 rounded-xl focus:bg-white/4 focus:border-primary/20 transition-all placeholder:text-muted-foreground/60"
                  aria-label="Cari transaksi"
                />
              </form>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-4 rounded-xl border-white/5 bg-white/2 hover:bg-white/5 text-xs font-bold min-w-[160px] justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="size-3.5 text-primary/70" />
                        <span className="text-muted-foreground group-hover:text-white">
                          {currentCategory === "all"
                            ? "Semua Kategori"
                            : currentCategory}
                        </span>
                      </div>
                      <ChevronDown className="size-3.5 text-muted-foreground/40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] bg-background/80 backdrop-blur-2xl border-white/10 rounded-2xl p-2 shadow-2xl"
                  >
                    <DropdownMenuItem
                      onClick={() => handleCategoryChange("all")}
                      className={cn(
                        "rounded-xl text-xs font-medium py-2.5",
                        currentCategory === "all" &&
                          "bg-primary/10 text-primary",
                      )}
                    >
                      Semua Kategori
                    </DropdownMenuItem>
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.name)}
                        className={cn(
                          "rounded-xl text-xs font-medium py-2.5",
                          currentCategory === cat.name &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {(currentSearch || currentCategory !== "all") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchValue("");
                      updateFilters({ search: "", category: "all" });
                    }}
                    className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95"
                    aria-label="Reset Filter"
                  >
                    <RotateCcw className="size-4" />
                  </Button>
                )}

                <div className="flex-1 md:flex-none" />

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-white/10 bg-white/3 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-10 px-4 transition-all active:scale-95 gap-2"
                  onClick={() =>
                    toast.info("Mengekspor data...", {
                      description: "File CSV Anda sedang disiapkan.",
                    })
                  }
                  aria-label="Export ke CSV"
                >
                  <Download className="size-3.5 text-primary" />
                  <span className="hidden sm:inline">Export CSV</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-muted/30">
                  <TableHead className="w-[120px] text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 py-4 pl-6">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 py-4">
                    Keterangan
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 py-4">
                    Kategori
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 py-4">
                    Jumlah
                  </TableHead>
                  <TableHead className="w-[50px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((row, i) => (
                    <TableRow
                      key={i}
                      onClick={() => handleRowClick(row)}
                      className="border-muted/20 cursor-pointer !hover:bg-primary/30 transition-colors duration-75"
                    >
                      <TableCell className="text-muted-foreground text-sm py-5 pl-6">
                        {new Date(row.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.description || row.store}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="secondary"
                            className="w-fit font-normal bg-muted/40"
                          >
                            {row.category?.name || "Lainnya"}
                          </Badge>
                          {row.type === "expense" && row.category?.priority && (
                            <span
                              className={cn(
                                "text-[8px] font-black uppercase tracking-widest ml-1",
                                row.category.priority === "Penting"
                                  ? "text-rose-500"
                                  : "text-amber-500",
                              )}
                            >
                              {row.category.priority === "Penting"
                                ? "Kebutuhan"
                                : "Keinginan"}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono font-bold",
                          row.type === "income"
                            ? "text-emerald-500"
                            : "text-rose-500",
                        )}
                      >
                        {row.type === "income" ? "+" : "-"}Rp{" "}
                        {row.amount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  <MoreVertical className="size-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              Opsi Transaksi
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end" className="w-40 bg-background/80 backdrop-blur-2xl border-white/10 rounded-xl p-1.5 shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">
                              Aksi
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem 
                              onClick={() => handleRowClick(row)}
                              className="rounded-lg text-xs font-bold py-2 gap-2 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                            >
                              <Pencil className="size-3.5" />
                              Ubah
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => openDeleteDialog(e, row.id)}
                              className="rounded-lg text-xs font-bold py-2 gap-2 focus:bg-rose-500/10 focus:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-[300px] text-center pointer-events-none"
                    >
                      <EmptyState
                        icon={Inbox}
                        title="Belum ada transaksi"
                        description="Mulai catat pengeluaran Anda hari ini untuk melacak kesehatan finansial."
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Premium Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-white/5 bg-white/1 gap-4">
                <div className="text-xs text-muted-foreground font-medium">
                  Halaman {pagination.currentPage} dari {pagination.totalPages}
                  <span className="mx-2 text-white/10">|</span>
                  Total {pagination.totalTransactions} Transaksi
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set(
                        "page",
                        (pagination.currentPage - 1).toString(),
                      );
                      router.push(`?${params.toString()}`);
                    }}
                    className="h-8 w-8 p-0 rounded-lg border-white/10 bg-transparent hover:bg-white/5 disabled:opacity-30"
                    aria-label="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set(
                        "page",
                        (pagination.currentPage + 1).toString(),
                      );
                      router.push(`?${params.toString()}`);
                    }}
                    className="h-8 w-8 p-0 rounded-lg border-white/10 bg-transparent hover:bg-white/5 disabled:opacity-30"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Modal Triggered by Row Click */}
            {selectedTransaction && (
              <TransactionModal
                transaction={selectedTransaction}
                categories={categories}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
              />
            )}

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
                      Hapus Transaksi?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground font-medium">
                      Tindakan ini tidak dapat dibatalkan. Saldo Anda akan
                      dikalkulasi ulang secara otomatis.
                    </AlertDialogDescription>
                  </div>
                </div>
                <AlertDialogFooter className="p-8 pt-0 flex flex-row gap-3">
                  <AlertDialogCancel className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5 bg-transparent m-0">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTransaction}
                    disabled={isDeleting}
                    className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 m-0"
                  >
                    {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* Savings Recommendations */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingDown className="size-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Tips Hemat
            </CardTitle>
            <CardDescription>Saran untuk kebutuhan sekunder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {totalSekunder > 0 ? (
              <>
                <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-sm">
                  <p className="font-bold text-primary mb-1">
                    Analisis Kebutuhan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pengeluaran sekunder Anda mencapai Rp{" "}
                    {totalSekunder.toLocaleString("id-ID")}. Coba evaluasi
                    kembali item non-esensial untuk menambah tabungan.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-sm">
                  <p className="font-bold text-primary mb-1">
                    Prinsip 50/30/20
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pastikan alokasi keinginan tidak melebihi 30% dari total
                    saldo Anda.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 text-center">
                <ShieldCheck className="size-12 text-emerald-500 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-bold">Kondisi Sangat Sehat!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Anda belum mencatat pengeluaran sekunder. Pertahankan disiplin
                  ini!
                </p>
              </div>
            )}
            <Button
              className={cn(
                "w-full rounded-xl font-bold shadow-lg transition-all active:scale-95",
                totalSekunder > 0
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
              )}
              onClick={() => {
                if (totalSekunder > 0) {
                  toast.success("AI Menganalisis Pola Hemat...", {
                    description:
                      "Rencana penghematan sedang disiapkan berdasarkan riwayat transaksi Anda.",
                  });
                  // Optionally navigate to budget tab to set limits
                  router.push(`/dashboard?range=${currentRange}&tab=anggaran`);
                } else {
                  router.push(`/dashboard?range=${currentRange}&tab=anggaran`);
                  toast.info("Mari atur target baru!", {
                    description:
                      "Pertahankan kondisi sehat dengan mengatur limit anggaran bulanan.",
                  });
                }
              }}
            >
              {totalSekunder > 0
                ? "Buat Rencana Hemat"
                : "Atur Target Anggaran"}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
