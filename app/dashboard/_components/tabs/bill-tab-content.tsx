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
  Bell,
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle,
  CreditCard,
  Home,
  Phone,
  Tv,
  Wifi,
  TrendingUp,
  Target,
  ArrowRight,
  Trash2,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { payBill, deleteBill } from "@/lib/actions";
import { BillModal } from "../bill-modal";
import { EmptyState } from "../empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ICON_MAP = {
  Zap,
  ShieldCheck,
  CreditCard,
  Tv,
  Wifi,
  Phone,
  Home,
};

interface BillTabContentProps {
  initialBills: any[];
  currency?: string;
}

export function BillTabContent({
  initialBills,
  currency = "IDR",
}: BillTabContentProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<any | null>(null);

  const currentMonthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
  }).format(new Date());

  const totalBills = initialBills.length;
  const paidBillsCount = initialBills.filter((b) => b.isPaid).length;
  const paymentProgress =
    totalBills > 0 ? (paidBillsCount / totalBills) * 100 : 0;

  const lastPaidBills = initialBills
    .filter((b) => b.isPaid)
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    )
    .slice(0, 2);

  const unpaidBills = initialBills.filter((b) => !b.isPaid);

  // Sort by smallest amount first for Snowball Method
  const snowballTarget = [...unpaidBills].sort(
    (a, b) => a.amount - b.amount,
  )[0];

  const handlePay = async (bill: any) => {
    setLoadingId(bill.id);
    try {
      await payBill(bill.id);
      toast.success(`Tagihan ${bill.name} berhasil dibayar`, {
        description: "Transaksi pengeluaran telah dicatat otomatis.",
      });
    } catch (error) {
      toast.error("Gagal memproses pembayaran");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!billToDelete) return;
    try {
      await deleteBill(billToDelete.id);
      toast.success("Tagihan berhasil dihapus");
      setBillToDelete(null);
    } catch (error) {
      toast.error("Gagal menghapus tagihan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Snowball Strategy Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {snowballTarget ? (
          <Card className="border-primary/30 bg-primary/5 backdrop-blur-md lg:col-span-2 relative overflow-hidden group border-2">
            <div className="absolute -right-10 -bottom-10 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <CardHeader className="flex flex-row items-center gap-5 relative z-10">
              <div className="size-16 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 rotate-3 group-hover:rotate-0 transition-transform">
                <Target className="size-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-widest px-2 py-0">
                    Target Snowball
                  </Badge>
                  <span className="text-[10px] font-black text-primary uppercase tracking-tighter">
                    Psikologi Kemenangan Kecil
                  </span>
                </div>
                <CardTitle className="text-2xl font-black">
                  Lunasin {snowballTarget.name} Dulu!
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Berdasarkan prinsip{" "}
                  <span className="text-primary font-bold italic">
                    Debt Snowball
                  </span>
                  , melunasi tagihan terkecil memberikan motivasi psikologis
                  terbesar.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 pb-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Sisa Tagihan
                </span>
                <span className="text-3xl font-mono font-black text-primary">
                  {formatCurrency(snowballTarget.amount, currency)}
                </span>
              </div>
              <Button
                onClick={() => handlePay(snowballTarget)}
                disabled={loadingId === snowballTarget.id}
                className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-xl shadow-primary/30 group/btn"
              >
                {loadingId === snowballTarget.id
                  ? "Memproses..."
                  : "Gaskan Lunasin!"}
                <ArrowRight className="ml-2 size-5 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md lg:col-span-2 relative overflow-hidden group min-h-[220px] flex flex-col justify-center border-2">
            {/* Animated Background Elements */}
            <div className="absolute -right-20 -top-20 size-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -left-20 -bottom-20 size-64 bg-emerald-500/5 rounded-full blur-3xl" />

            <CardContent className="relative z-10 p-10 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-ping duration-1000" />
                <div className="size-20 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] relative border-4 border-emerald-400/20">
                  <CheckCircle className="size-10" />
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-3xl font-black text-emerald-500 tracking-tight">
                  Semua Tagihan Lunas!
                </CardTitle>
                <p className="text-muted-foreground font-medium max-w-[320px] mx-auto text-sm">
                  Hebat! Kamu telah menyelesaikan semua kewajiban finansialmu
                  bulan ini. Nikmati ketenangan pikiranmu!
                </p>
              </div>

              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest"
              >
                Financial Peace Achieved
              </Badge>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/40 bg-card/30 backdrop-blur-md flex flex-col justify-center p-6 relative overflow-hidden group">
          <div className="absolute right-0 top-0 size-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl" />
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1 opacity-60">
            Total Tagihan {currentMonthName}
          </p>
          <p className="text-4xl font-mono font-black tracking-tighter">
            {formatCurrency(
              initialBills.reduce((acc, curr) => acc + curr.amount, 0),
              currency,
            )}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase">
            <TrendingUp className="size-3" />
            {unpaidBills.length} Tagihan Menunggu
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Bill List */}
        <Card className="border-border/40 bg-card/30 md:col-span-2">
          <CardHeader>
            <CardTitle>Daftar Tagihan Aktif</CardTitle>
            <CardDescription>
              Kelola dan pantau semua kewajiban bulanan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/30">
              {initialBills.map((bill, i) => {
                const BillIcon =
                  ICON_MAP[bill.iconName as keyof typeof ICON_MAP] || Zap;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between p-6 hover:bg-muted/10 transition-colors",
                      bill.isPaid && "opacity-60",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "size-12 rounded-2xl flex items-center justify-center border",
                          bill.isPaid
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : bill.urgent
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : "bg-muted/30 text-muted-foreground border border-border/40",
                        )}
                      >
                        {bill.isPaid ? (
                          <CheckCircle className="size-5" />
                        ) : (
                          <BillIcon className="size-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{bill.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            {bill.provider}
                          </p>
                          <span className="size-1 rounded-full bg-muted-foreground/30" />
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            Jatuh tempo:{" "}
                            {(() => {
                              try {
                                const d = new Date(bill.dueDate);
                                if (isNaN(d.getTime())) return bill.dueDate;
                                return new Intl.DateTimeFormat("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }).format(d);
                              } catch (e) {
                                return bill.dueDate;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="font-mono font-black text-lg">
                          {formatCurrency(bill.amount, currency)}
                        </p>
                        {!bill.isPaid && bill.urgent && (
                          <Badge
                            variant="outline"
                            className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] py-0"
                          >
                            Segera
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setBillToDelete(bill)}
                          className="size-8 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          aria-label={`Hapus tagihan ${bill.name}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          disabled={bill.isPaid || loadingId === bill.id}
                          onClick={() => handlePay(bill)}
                          className={cn(
                            "h-8 text-xs font-bold rounded-lg shadow-lg min-w-[100px]",
                            bill.isPaid
                              ? "bg-emerald-500/20 text-emerald-500 cursor-default"
                              : bill.urgent
                                ? "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"
                                : "bg-background border border-border/40 text-foreground hover:bg-muted/50",
                          )}
                        >
                          {loadingId === bill.id
                            ? "Memproses..."
                            : bill.isPaid
                              ? "Lunas"
                              : bill.urgent
                                ? "Bayar Sekarang"
                                : "Tandai Lunas"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {initialBills.length === 0 && (
                <EmptyState 
                  icon={Inbox}
                  title="Tidak ada tagihan aktif"
                  description="Semua kewajiban Anda telah terbayar atau belum ada tagihan yang didaftarkan."
                  className="py-20"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: History & Stats */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/30 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">
                Status Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-emerald-500">
                    Sudah Dibayar
                  </p>
                  <CheckCircle className="size-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-black">
                  {paidBillsCount}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    dari {totalBills} tagihan
                  </span>
                </p>
                <Progress
                  value={paymentProgress}
                  className="h-1.5 mt-3 bg-emerald-500/10"
                  indicatorClassName="bg-emerald-500"
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-3">
                  Terakhir Dibayar
                </p>
                {lastPaidBills.length > 0 ? (
                  lastPaidBills.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.amount, currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-2">
                    Belum ada pembayaran lunas.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-primary/10 backdrop-blur-md border-dashed">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <CreditCard className="size-6" />
              </div>
              <div>
                <p className="font-bold">Tambah Tagihan Baru</p>
                <p className="text-xs text-muted-foreground px-4 mt-1">
                  Jangan pernah melewatkan pembayaran lagi dengan pengingat
                  otomatis.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full rounded-xl border-primary/30 hover:bg-primary/20 transition-all active:scale-[0.98] font-bold"
              >
                Mulai Atur Tagihan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BillModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      <AlertDialog
        open={!!billToDelete}
        onOpenChange={(open) => !open && setBillToDelete(null)}
      >
        <AlertDialogContent className="bg-background/40 backdrop-blur-3xl border-white/10 rounded-[32px] overflow-hidden shadow-2xl p-0 sm:max-w-[400px]">
          <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-rose-500/10 to-transparent pointer-events-none" />
          <div className="p-8 pt-10 flex flex-col items-center text-center space-y-4">
            <div className="size-16 rounded-3xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
              <AlertTriangle className="size-8" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Hapus Tagihan?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground font-medium">
                Tindakan ini tidak dapat dibatalkan. Tagihan{" "}
                <span className="text-foreground font-bold italic">
                  {billToDelete?.name}
                </span>{" "}
                akan dihapus permanen.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter className="p-8 pt-0 flex flex-row gap-3">
            <AlertDialogCancel className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5 bg-transparent m-0">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-500/20 m-0"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
