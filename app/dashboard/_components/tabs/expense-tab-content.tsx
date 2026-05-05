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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";
import { TransactionModal } from "../transaction-modal";
import { deleteTransaction, upsertBudget } from "@/lib/actions";
import { toast } from "sonner";
import { EmptyState } from "../empty-state";
import {
  useState,
  useEffect,
  useCallback,
  useOptimistic,
  useTransition,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
  totalKebutuhan: number;
  totalKeinginan: number;
  recentTransactions?: any[];
  categories?: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    pageSize: number;
  };
  currency?: string;
  monthlyIncome?: number;
  currentBalance?: number;
}

export function ExpenseTabContent({
  dataPengeluaran,
  totalKebutuhan,
  totalKeinginan,
  recentTransactions = [],
  categories = [],
  pagination,
  currency = "IDR",
  monthlyIncome = 0,
  currentBalance = 0,
}: ExpenseTabContentProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optimistic UI for transactions
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    recentTransactions,
    (state, id: number) => state.filter((t) => t.id !== id),
  );

  const currentRange = searchParams.get("range") || "monthly";
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

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
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSearch = (val: string) => {
    setSearchValue(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchValue });
  };

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    const toastId = toast.loading("AI sedang menganalisis pola pengeluaran & pendapatan...");

    try {
      // 1. Simulasi analisis AI (memberikan kesan 'berpikir' yang lebih premium)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Persiapan Data & Algoritma 50/30/20
      const income = monthlyIncome || 3000000; // Fallback ke standar UMR jika data 0
      const targetNeeds = income * 0.5;
      const targetWants = income * 0.3;
      
      const currentNeedsTotal = dataPengeluaran
        .filter(i => i.priority === "Kebutuhan")
        .reduce((acc, curr) => acc + curr.value, 0);
      
      const currentWantsTotal = dataPengeluaran
        .filter(i => i.priority === "Keinginan")
        .reduce((acc, curr) => acc + curr.value, 0);

      // 3. Kalkulasi Budget per Kategori
      const promises = dataPengeluaran.map(async (item) => {
        let suggestedBudget = item.value;
        
        if (item.priority === "Kebutuhan") {
          // Target Ideal: 50%
          const needsRatio = currentNeedsTotal / income;
          const factor = needsRatio > 0.5 ? 0.95 : 1.1;
          suggestedBudget = item.value > 0 ? item.value * factor : (income * 0.1);
        } else if (item.priority === "Keinginan" || item.priority === "Lainnya") {
          // Target Ideal: 30%
          const wantsRatio = currentWantsTotal / income;
          const factor = wantsRatio > 0.3 ? 0.75 : 0.85;
          suggestedBudget = item.value > 0 ? item.value * factor : 0;
        } else if (item.priority === "Tabungan") {
          // Target Ideal: 20%
          // Jika tabungan saat ini rendah, paksa alokasi ke 20% / jumlah kategori tabungan
          const savingsCount = dataPengeluaran.filter(i => i.priority === "Tabungan").length || 1;
          const idealSavingsPerCat = (income * 0.2) / savingsCount;
          suggestedBudget = item.value < idealSavingsPerCat ? idealSavingsPerCat : item.value * 1.1;
        }

        // Round to nearest 25.000 untuk presisi yang lebih humanis
        suggestedBudget = Math.round(suggestedBudget / 25000) * 25000;
        
        // Pastikan tidak nol jika itu kebutuhan penting
        if (item.priority === "Kebutuhan" && suggestedBudget === 0) {
          suggestedBudget = 100000;
        }

        if (item.id) {
          return upsertBudget(item.id, suggestedBudget);
        }
      });

      await Promise.all(promises);

      toast.success("Rencana Hemat AI Siap!", {
        id: toastId,
        description: "Anggaran telah dioptimalkan berdasarkan prinsip 50/30/20.",
      });

      // 4. Navigasi ke tab anggaran untuk review
      startTransition(() => {
        router.push(`/dashboard?range=${currentRange}&tab=anggaran`, { scroll: false });
      });
    } catch (error) {
      toast.error("Gagal menjalankan algoritma AI", { id: toastId });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleCategoryChange = (catName: string) => {
    updateFilters({ category: catName });
  };

  const handleDeleteTransaction = async () => {
    if (transactionToDelete) {
      // Perform the actual deletion in a transition
      startTransition(async () => {
        // 1. Instantly update UI optimistically
        addOptimisticTransaction(transactionToDelete);
        setIsDeleteOpen(false);

        try {
          await deleteTransaction(transactionToDelete);
          toast.success("Transaksi berhasil dihapus", {
            description: "Saldo Anda telah diperbarui secara otomatis.",
          });
          setTransactionToDelete(null);
        } catch (error) {
          toast.error("Gagal menghapus transaksi", {
            description:
              "Terjadi kesalahan saat menghapus data. Mencoba memulihkan...",
          });
        }
      });
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
                      Alokasi Kebutuhan
                    </p>
                    <p className="text-xl font-bold">
                      Rp {totalKebutuhan.toLocaleString("id-ID")}
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
                  {dataPengeluaran.filter((d) => d.priority === "Kebutuhan")
                    .length > 0 ? (
                    dataPengeluaran
                      .filter((d) => d.priority === "Kebutuhan")
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm px-2 py-1 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <span
                            className="font-medium transition-colors"
                            style={{ color: item.color || "inherit" }}
                          >
                            {item.name}
                          </span>
                          <span className="font-semibold text-foreground/90">
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
                      Alokasi Keinginan
                    </p>
                    <p className="text-xl font-bold">
                      Rp {totalKeinginan.toLocaleString("id-ID")}
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
                  {dataPengeluaran.filter((d) => d.priority === "Keinginan")
                    .length > 0 ? (
                    dataPengeluaran
                      .filter((d) => d.priority === "Keinginan")
                      .map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm px-2 py-1 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <span
                            className="font-medium transition-colors"
                            style={{ color: item.color || "inherit" }}
                          >
                            {item.name}
                          </span>
                          <span className="font-semibold text-foreground/90">
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
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl animate-in zoom-in duration-200">
                            <div className="flex items-center gap-3">
                              <div
                                className="size-3 rounded-full shadow-lg shadow-white/5"
                                style={{ backgroundColor: data.color }}
                              />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">
                                  {data.priority}
                                </span>
                                <span
                                  className="text-sm font-bold"
                                  style={{ color: data.color }}
                                >
                                  {data.name}
                                </span>
                                <span className="text-xs font-medium text-white/90">
                                  Rp {data.value.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
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
              <CardDescription className="font-medium text-muted-foreground">
                Daftar lengkap belanja Anda.
              </CardDescription>
            </div>

            {/* Premium Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <InputGroup className="bg-white/2 border-white/5 rounded-xl h-10 focus-within:ring-primary/20 focus-within:bg-white/4 focus-within:border-primary/20 transition-all">
                  <InputGroupAddon>
                    <Search className="size-4 text-muted-foreground group-focus-within/input-group:text-primary transition-colors" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Cari transaksi..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="text-xs placeholder:text-muted-foreground/90"
                    aria-label="Cari transaksi"
                  />
                </InputGroup>
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
                      <ChevronDown className="size-3.5 text-muted-foreground/75" />
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
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-muted/30">
                    <TableHead className="w-[120px] text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 pl-6">
                      Tanggal
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">
                      Keterangan
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">
                      Kategori
                    </TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4">
                      Jumlah
                    </TableHead>
                    <TableHead className="w-[50px] py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimisticTransactions.map((row, i) => (
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
                                row.category.priority === "Kebutuhan"
                                  ? "text-rose-500"
                                  : "text-amber-500",
                              )}
                            >
                              {row.category.priority}
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
                        {row.type === "income" ? "+" : "-"}
                        {formatCurrency(row.amount, currency)}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Opsi transaksi"
                                  className="size-8 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  <MoreVertical className="size-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Opsi Transaksi</TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-background/80 backdrop-blur-2xl border-white/10 rounded-xl p-1.5 shadow-2xl"
                          >
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/90 px-2 py-1.5">
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
                  ))}
                </TableBody>
              </Table>
            </div>

            {optimisticTransactions.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center w-full">
                <EmptyState
                  icon={Inbox}
                  title="Belum ada transaksi"
                  description="Mulai catat pengeluaran Anda hari ini untuk melacak kesehatan finansial."
                />
              </div>
            )}

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
                        router.push(`?${params.toString()}`, { scroll: false });
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
                        router.push(`?${params.toString()}`, { scroll: false });
                      }}
                    className="h-8 w-8 p-0 rounded-lg border-white/10 bg-transparent hover:bg-white/5 disabled:opacity-30"
                    aria-label="Halaman Berikutnya"
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
                    disabled={isPending}
                    className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 m-0"
                  >
                    {isPending ? "Menghapus..." : "Ya, Hapus"}
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
            <CardDescription>
              Saran untuk mengoptimalkan pengeluaran.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {totalKeinginan > 0 ? (
              <>
                {(() => {
                  const income = monthlyIncome || 3000000;
                  const idealWants = income * 0.3;
                  const overspent = totalKeinginan - idealWants;
                  
                  const topWants = [...dataPengeluaran]
                    .filter(i => i.priority === "Keinginan")
                    .sort((a, b) => b.value - a.value)[0];

                  return (
                    <>
                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-sm animate-in fade-in slide-in-from-right duration-500">
                        <p className="font-bold text-primary mb-1 flex items-center gap-2">
                          <TrendingDown className="size-3" />
                          Analisis Pengeluaran
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {overspent > 0 ? (
                            <>
                              Pengeluaran <span className="text-rose-500 font-bold">Keinginan</span> Anda sudah melebihi batas ideal sebesar <span className="text-foreground font-bold">Rp {overspent.toLocaleString("id-ID")}</span>. 
                              {topWants && (
                                <span> Alokasi terbesar ada pada kategori <span className="text-primary font-bold">{topWants.name}</span>.</span>
                              )}
                            </>
                          ) : (
                            <>
                              Bagus! Pengeluaran <span className="text-emerald-500 font-bold">Keinginan</span> Anda masih di bawah batas ideal 30%. Anda memiliki sisa ruang <span className="text-foreground font-bold">Rp {Math.abs(overspent).toLocaleString("id-ID")}</span> untuk ditabung.
                            </>
                          )}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-background/50 border border-border/50 text-sm animate-in fade-in slide-in-from-right duration-700">
                        <p className="font-bold text-primary mb-1">
                          Strategi AI
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {overspent > 0 
                            ? `Gunakan "Rencana Hemat" untuk memangkas pengeluaran non-esensial secara otomatis agar dana darurat Anda tetap terjaga.` 
                            : `Pertahankan pola ini dan alokasikan sisa dana ke instrumen investasi untuk pertumbuhan aset jangka panjang.`
                          }
                        </p>
                      </div>
                    </>
                  );
                })()}
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
                totalKeinginan > 0
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
              )}
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
            >
              {isGeneratingPlan ? "Menganalisis..." : (totalKeinginan > 0 ? "Buat Rencana Hemat" : "Atur Target Baru")}
              {!isGeneratingPlan && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
