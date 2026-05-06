"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = await signIn(data);

    if (result?.error) {
      setErrors(result.error as any);
      const formError = (result.error as any).form;
      if (formError) {
        toast.error(formError[0]);
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 rounded-[32px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent" />
        
        <CardHeader className="space-y-4 pt-8 pb-4">
          <div className="flex justify-center">
            <div className="size-16 rounded-[22px] bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group hover:scale-110 transition-transform duration-500">
              <Wallet className="size-8 text-white group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight text-white">Selamat Datang</CardTitle>
            <CardDescription className="text-muted-foreground font-medium italic">
              Masuk ke akun SakuKu untuk mengelola keuanganmu.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                  <Mail className="size-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@sakuku.com"
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-11 focus:ring-primary/30 transition-all text-white placeholder:text-muted-foreground/30"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
                  Password
                </Label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.15em] text-primary hover:text-primary/80 transition-colors">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors">
                  <Lock className="size-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-11 pr-11 focus:ring-primary/30 transition-all text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.password[0]}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  MENYAMBUNGKAN...
                </>
              ) : (
                "MASUK KE DASHBOARD"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="pb-8 pt-4 flex flex-col space-y-4">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">atau</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-black hover:underline underline-offset-4">
              Buat Impian Baru
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Brand Label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/20 uppercase">
          SakuKu Premium v2.0
        </p>
      </div>
    </div>
  );
}
