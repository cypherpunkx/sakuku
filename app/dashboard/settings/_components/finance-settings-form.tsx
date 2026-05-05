"use client";

import { useState } from "react";
import { Coins, CalendarDays, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateFinanceSettings } from "@/lib/actions/user.actions";

interface FinanceSettingsFormProps {
  user: any;
}

const currencies = [
  { label: "IDR - Rupiah Indonesia", value: "IDR" },
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "SGD - Singapore Dollar", value: "SGD" },
  { label: "JPY - Japanese Yen", value: "JPY" },
];

export function FinanceSettingsForm({ user }: FinanceSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currency: user?.currency || "IDR",
    budgetStartDay: user?.budgetStartDay || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateFinanceSettings(formData);
      if (result.success) {
        toast.success("Pengaturan keuangan berhasil diperbarui!", {
          description:
            "Perubahan akan diterapkan pada laporan dan anggaran Anda.",
        });
      } else {
        toast.error("Gagal memperbarui pengaturan", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem", {
        description: "Silakan coba beberapa saat lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/40 bg-background/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Konfigurasi Keuangan
        </CardTitle>
        <CardDescription>
          Sesuaikan cara SakuKu mengolah data finansial Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 grid-cols-1">
            {/* Currency Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="currency"
                className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-wider"
              >
                Mata Uang Utama
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, currency: val }))
                }
              >
                <SelectTrigger
                  id="currency"
                  className="py-6 h-14 bg-background/50 border-border/40 rounded-2xl focus:ring-primary/20 transition-all hover:bg-background/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Coins className="size-4 text-primary" />
                    </div>
                    <SelectValue placeholder="Pilih Mata Uang" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-2xl">
                  {currencies.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className="focus:bg-primary/10 rounded-xl py-3"
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground ml-1">
                Semua nominal transaksi akan ditampilkan dalam format ini.
              </p>
            </div>

            {/* Budget Start Day */}
            <div className="space-y-3">
              <Label
                htmlFor="budgetStartDay"
                className="text-sm font-bold ml-1 text-muted-foreground uppercase tracking-wider"
              >
                Siklus Bulanan
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-primary/10 transition-colors group-focus-within:bg-primary/20">
                  <CalendarDays className="size-4 text-primary" />
                </div>
                <Input
                  id="budgetStartDay"
                  name="budgetStartDay"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="1-31"
                  value={formData.budgetStartDay}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      budgetStartDay: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="pl-14 h-14 bg-background/50 border-border/40 focus:border-primary/50 transition-all rounded-2xl hover:bg-background/80"
                  required
                />
              </div>
              <p className="text-[10px] text-muted-foreground ml-1">
                Anggaran akan di-reset otomatis setiap tanggal{" "}
                <span className="font-bold text-primary">
                  {formData.budgetStartDay}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button
              type="submit"
              disabled={loading}
              className="px-10 h-14 bg-gradient-premium text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-5" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
