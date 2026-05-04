"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  CreditCard,
  ShieldCheck,
  Tv,
  Wifi,
  Phone,
  Home,
  Trash2,
  Plus,
} from "lucide-react";
import { addBill } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BILL_ICONS = [
  { name: "Zap", icon: Zap, color: "#f59e0b" },
  { name: "CreditCard", icon: CreditCard, color: "#3b82f6" },
  { name: "ShieldCheck", icon: ShieldCheck, color: "#10b981" },
  { name: "Tv", icon: Tv, color: "#f43f5e" },
  { name: "Wifi", icon: Wifi, color: "#8b5cf6" },
  { name: "Phone", icon: Phone, color: "#06b6d4" },
  { name: "Home", icon: Home, color: "#6366f1" },
];

interface BillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillModal({ open, onOpenChange }: BillModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "",
    amount: "",
    dueDate: new Date().toLocaleDateString("en-CA"),
    urgent: false,
    iconName: "Zap",
  });

  const handleSave = async () => {
    if (!formData.name || !formData.amount) {
      toast.error("Mohon isi nama tagihan dan jumlah");
      return;
    }

    setLoading(true);
    try {
      await addBill({
        ...formData,
        amount: parseInt(formData.amount.replace(/\./g, "")) || 0,
      });
      toast.success("Tagihan baru berhasil ditambahkan");
      onOpenChange(false);
      setFormData({
        name: "",
        provider: "",
        amount: "",
        dueDate: new Date().toLocaleDateString("en-CA"),
        urgent: false,
        iconName: "Zap",
      });
    } catch (error) {
      toast.error("Gagal menambahkan tagihan");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val === "") {
      setFormData({ ...formData, amount: "" });
      return;
    }
    const formatted = parseInt(val).toLocaleString("id-ID");
    setFormData({ ...formData, amount: formatted });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right"
        className="w-full sm:max-w-lg bg-background/40 backdrop-blur-3xl border-l border-white/10 shadow-2xl overflow-hidden p-0 gap-0 focus:outline-none flex flex-col"
      >
        <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

        <SheetHeader className="p-8 pb-0 relative z-10">
          <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Plus className="size-7 text-primary" />
          </div>
          <SheetTitle className="text-2xl font-black tracking-tight">
            Atur Tagihan Baru
          </SheetTitle>
          <SheetDescription className="text-muted-foreground font-medium">
            SakuKu akan mengingatkan Anda sebelum jatuh tempo.
          </SheetDescription>
        </SheetHeader>
        <Separator className="bg-white/5" />

        <div className="p-8 space-y-6 relative z-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground/70">
                Nama Tagihan
              </Label>
              <Input
                placeholder="Listrik PLN, Netflix, dll"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-background/50 border-white/10 rounded-xl h-11 px-4 font-bold"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground/70">
                Penyedia / Provider
              </Label>
              <Input
                placeholder="PLN, Netflix Inc"
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                className="bg-background/50 border-white/10 rounded-xl h-11 px-4 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground/70">
              Jumlah Tagihan
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-muted-foreground/50">
                RP
              </span>
              <Input
                value={formData.amount}
                onChange={handleAmountChange}
                className="bg-background/50 border-white/10 rounded-2xl h-14 pl-12 text-xl font-mono font-black"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground/70">
                Jatuh Tempo
              </Label>
              <DatePicker
                value={formData.dueDate}
                onChange={(val) =>
                  setFormData({ ...formData, dueDate: val })
                }
                placeholder="Pilih jatuh tempo"
              />
            </div>
            <div className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border",
              formData.urgent 
                ? "bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                : "bg-muted/20 border-white/5"
            )}>
              <div className="space-y-0.5">
                <Label className={cn(
                  "text-[10px] font-black uppercase tracking-widest transition-colors",
                  formData.urgent ? "text-rose-500" : "text-muted-foreground/70"
                )}>
                  Prioritas Tinggi
                </Label>
                <p className="text-[10px] text-muted-foreground font-medium">
                  Ingatkan lebih sering
                </p>
              </div>
              <Switch
                checked={formData.urgent}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, urgent: val })
                }
                className="data-[state=checked]:bg-rose-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground/70">
              Pilih Ikon
            </Label>
            <div className="flex flex-wrap gap-3">
              {BILL_ICONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() =>
                      setFormData({ ...formData, iconName: item.name })
                    }
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center border transition-all duration-300 active:scale-90",
                      formData.iconName === item.name
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : "bg-background/50 border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/5"
                    )}
                  >
                    <Icon className="size-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <SheetFooter className="p-8 pt-2 relative z-10 flex flex-row gap-4 mt-auto">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:bg-white/5 transition-all"
          >
            Batal
          </Button>
          <Button
            disabled={loading}
            onClick={handleSave}
            className="flex-1 rounded-2xl h-14 bg-linear-to-r from-primary to-primary/80 hover:to-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? "Menyimpan..." : "Simpan Tagihan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
