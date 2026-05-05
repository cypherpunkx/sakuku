"use client";

import { Crown, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MembershipCard() {
  return (
    <Card className="overflow-hidden border-primary/20 bg-background/40 backdrop-blur-xl relative group">
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-black italic tracking-tight">
            SakuKu Premium
          </CardTitle>
          <Badge className="bg-gradient-premium text-primary-foreground border-none px-3 py-1 font-bold animate-pulse">
            AKTIF
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="size-12 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary/20">
            <Crown className="size-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Status Keanggotaan
            </p>
            <p className="text-lg font-bold text-foreground">Premium Member</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
            Manfaat Premium Anda
          </p>
          <ul className="grid gap-2">
            {[
              "Laporan Keuangan Eksklusif",
              "Kustomisasi Kategori Tanpa Batas",
              "Sinkronisasi Cloud Real-time",
              "Prioritas Dukungan Pelanggan",
            ].map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80"
              >
                <CheckCircle2 className="size-4 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground text-center italic">
            Langganan Anda akan diperbarui secara otomatis pada 24 Mei 2026.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
