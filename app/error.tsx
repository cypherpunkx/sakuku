"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Decorative elements matching Design System */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-rose-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute top-1/4 right-1/4 size-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md w-full bg-background/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[32px] overflow-hidden relative group">
        <div className="absolute inset-0 bg-linear-to-b from-rose-500/5 to-transparent pointer-events-none" />
        
        <div className="p-8 pb-4 text-center space-y-4">
          <div className="mx-auto size-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2 shadow-lg shadow-rose-500/10">
            <AlertCircle className="size-10 text-rose-500 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Ups! Terjadi Kesalahan
            </h1>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Aplikasi mengalami kendala teknis yang tidak terduga. Kami telah mencatat kejadian ini.
            </p>
          </div>

          {error.digest && (
            <div className="py-2 px-3 bg-muted/20 rounded-lg inline-block">
              <code className="text-[10px] font-mono text-muted-foreground/50">
                Error ID: {error.digest}
              </code>
            </div>
          )}
        </div>

        <div className="p-8 pt-4 flex flex-col gap-3 relative z-10">
          <Button 
            onClick={() => reset()} 
            size="lg"
            className="w-full py-8 rounded-[24px] font-black text-xl bg-rose-500 hover:bg-rose-600 text-white shadow-2xl shadow-rose-500/30 transition-all active:scale-[0.97] border border-white/10"
          >
            <RotateCcw className="mr-2 size-6" />
            Coba Lagi
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg"
            onClick={() => router.push("/")}
            className="w-full py-6 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-all"
          >
            <Home className="mr-2 size-5" />
            Kembali ke Beranda
          </Button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 pb-6 font-medium italic">
          Bantuan teknis tersedia jika masalah berlanjut
        </p>
      </div>
    </div>
  );
}
