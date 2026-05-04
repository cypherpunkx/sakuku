"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/4 right-1/4 size-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-lg w-full bg-background/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[32px] overflow-hidden relative group">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="p-8 text-center space-y-8 relative z-10">
          <div className="relative inline-block">
            <h1 className="text-8xl font-black leading-none tracking-tighter text-muted/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 rounded-2xl bg-primary/10 backdrop-blur-xl border border-primary/20 flex items-center justify-center transform rotate-12 shadow-2xl shadow-primary/20 group-hover:rotate-0 transition-transform duration-500">
                <Search className="size-10 text-primary animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan ke dimensi lain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <Button 
              size="lg"
              onClick={() => router.push("/")}
              className="flex-1 py-8 rounded-[24px] font-black text-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 transition-all active:scale-[0.97] border border-white/10"
            >
              <Home className="mr-2 size-6" />
              Beranda
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              className="flex-1 py-8 rounded-[24px] font-black text-xl bg-background/50 backdrop-blur-md border-white/10 hover:bg-muted/10 transition-all active:scale-[0.97]"
            >
              <ArrowLeft className="mr-2 size-6" />
              Kembali
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 pb-6 font-medium italic">
          SakuKu Finance • Navigasi Cerdas
        </p>
      </div>
    </div>
  );
}
