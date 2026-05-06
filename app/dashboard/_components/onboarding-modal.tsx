"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { completeOnboarding } from "@/lib/actions";
import { Wallet, Sparkles, Rocket, ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OnboardingModal({ user }: { user: any }) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(!user.hasOnboarding);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    balance: 0,
    currency: "IDR",
    budgetStartDay: 1,
  });

  const [displayBalance, setDisplayBalance] = useState("0");

  // Load draft
  useEffect(() => {
    const saved = sessionStorage.getItem("sakuku_onboarding_draft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData);
        setStep(parsed.step);
        setDisplayBalance(parsed.displayBalance);
      } catch (e) {}
    }
  }, []);

  // Save draft
  useEffect(() => {
    sessionStorage.setItem("sakuku_onboarding_draft", JSON.stringify({
      formData,
      step,
      displayBalance
    }));
  }, [formData, step, displayBalance]);

  const formatNumber = (num: string) => {
    const value = num.replace(/\D/g, "");
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    // Hapus leading zeros dengan mengubah ke number lalu balik ke string
    // kecuali jika nilainya kosong, maka set ke "0"
    const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    const formattedValue = formatNumber(numericValue.toString());
    
    setDisplayBalance(formattedValue === "0" && rawValue === "" ? "" : formattedValue);
    setFormData({ ...formData, balance: numericValue });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  async function handleFinish() {
    setIsLoading(true);
    const result = await completeOnboarding(formData);
    if (result.success) {
      toast.success("Pengaturan awal selesai! Selamat menikmati SakuKu.");
      sessionStorage.removeItem("sakuku_onboarding_draft");
      setIsOpen(false);
    } else {
      toast.error("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-[#020617] border-white/10 backdrop-blur-3xl p-0 overflow-hidden rounded-[32px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent" />

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="size-16 rounded-[22px] bg-primary flex items-center justify-center shadow-lg shadow-primary/40 mx-auto mb-6">
                <Rocket className="size-8 text-white" />
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="text-3xl font-black text-white leading-tight">
                  Halo, {user.name.split(" ")[0]}!
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-lg pt-2 italic">
                  Selamat datang di SakuKu. Mari kita atur fondasi finansialmu
                  dalam sekejap.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={nextStep}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20"
              >
                MULAI SEKARANG <ArrowRight className="ml-2 size-5" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Wallet className="size-6" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl">Saldo Awal</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Langkah 1 dari 2
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                    Mata Uang
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(v) =>
                      setFormData({ ...formData, currency: v })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                      <SelectValue placeholder="Pilih Mata Uang" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-white/10 text-white rounded-2xl p-2">
                      <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
                      <SelectItem value="USD">Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                    Berapa saldomu saat ini?
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-sm">
                      {formData.currency === "IDR" ? "Rp" : formData.currency === "USD" ? "$" : "€"}
                    </div>
                    <Input
                      type="text"
                      value={displayBalance}
                      onChange={handleBalanceChange}
                      placeholder="0"
                      className="bg-white/5 border-white/10 rounded-2xl h-14 pl-12 text-white font-black text-xl focus:ring-emerald-500/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="flex-1 h-12 rounded-2xl font-bold text-muted-foreground/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  KEMBALI
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-2 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
                >
                  LANJUT
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <h3 className="font-black text-white text-xl">
                    Siklus Anggaran
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Langkah 2 dari 2
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                    Kapan gajian atau siklusmu dimulai?
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={formData.budgetStartDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budgetStartDay: Number(e.target.value),
                      })
                    }
                    className="bg-white/5 border-white/10 rounded-2xl h-12 text-white font-bold text-center text-2xl"
                  />
                  <p className="text-[10px] text-muted-foreground text-center italic">
                    Contoh: Jika gajian tanggal 25, masukkan 25.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  className="flex-1 h-14 rounded-2xl font-bold text-muted-foreground/60 hover:text-white hover:bg-white/5 transition-all"
                  disabled={isLoading}
                >
                  KEMBALI
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="flex-2 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-[0_8px_25px_rgba(139,92,246,0.3)] transition-all active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <>
                      SELESAI & MASUK <Check className="ml-2 size-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Dots */}
        <div className="bg-white/5 py-4 flex justify-center gap-2 border-t border-white/5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "size-1.5 rounded-full transition-all duration-300",
                step === s ? "w-6 bg-primary" : "bg-white/20",
              )}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
