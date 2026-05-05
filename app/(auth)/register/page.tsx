"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Loader2, Mail, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const result = await signUp(data);

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
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative z-10 rounded-[32px] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent" />
        
        <CardHeader className="space-y-4 pt-8 pb-4">
          <div className="flex justify-center">
            <div className="size-16 rounded-[22px] bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 group hover:scale-110 transition-transform duration-500">
              <Sparkles className="size-8 text-white group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight text-white">Mulai Impianmu</CardTitle>
            <CardDescription className="text-muted-foreground font-medium italic">
              Daftar sekarang dan kelola keuangan dengan cerdas.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Full Name
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-emerald-500 transition-colors">
                  <User className="size-4" />
                </div>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-11 focus:ring-emerald-500/30 transition-all text-white placeholder:text-muted-foreground/30"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="size-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-11 focus:ring-emerald-500/30 transition-all text-white placeholder:text-muted-foreground/30"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70 ml-1">
                Create Password
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="size-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-11 pr-11 focus:ring-emerald-500/30 transition-all text-white placeholder:text-muted-foreground/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-emerald-500 transition-colors focus:outline-none"
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
              className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  MENDAFTARKAN...
                </>
              ) : (
                "BUAT AKUN SEKARANG"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="pb-8 pt-4 flex flex-col space-y-4">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">sudah punya akun?</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 text-white font-bold">
              KEMBALI KE LOGIN
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Brand Label */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/20 uppercase">
          Financial Freedom Starts Here
        </p>
      </div>
    </div>
  );
}
