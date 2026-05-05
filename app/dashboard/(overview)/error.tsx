"use client";
 
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-8">
      {/* Premium Error Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative size-24 rounded-[32px] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-2xl shadow-rose-500/10">
          <AlertTriangle className="size-12 text-rose-500" />
        </div>
      </div>
 
      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Ups! Ada Masalah.
        </h1>
        <p className="text-muted-foreground font-medium leading-relaxed">
          Gagal memuat data dashboard. Ini mungkin karena koneksi internet yang terputus atau gangguan pada server kami.
        </p>
        {process.env.NODE_ENV === "development" && (
           <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border/40 text-left overflow-auto max-h-40">
             <code className="text-[10px] text-rose-400 font-mono">
               {error.message}
             </code>
           </div>
        )}
      </div>
 
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button
          onClick={() => reset()}
          className="flex-1 rounded-2xl h-14 bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          <RotateCcw className="size-5 mr-2" />
          Coba Lagi
        </Button>
        <Link href="/" className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-2xl h-14 border-white/10 bg-white/5 hover:bg-white/10 font-bold text-lg active:scale-95 transition-all"
          >
            <Home className="size-5 mr-2" />
            Beranda
          </Button>
        </Link>
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
        Error Code: {error.digest || "FETCH_FAILED"}
      </p>
    </div>
  );
}
