"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";

export function UserNav({ user }: { user?: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : "AD";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div 
          className="relative group cursor-pointer" 
          role="button" 
          aria-label="Menu Pengguna"
        >
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Avatar className="relative h-9 w-9 border border-primary/20 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:scale-105">
            <AvatarImage
              src={user?.image || "https://github.com/shadcn.png"}
              alt={user?.name}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-2 glass-morphism-heavy rounded-2xl border-primary/10"
      >
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/10">
              <AvatarImage
                src={user?.image || "https://github.com/shadcn.png"}
              />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-bold leading-none text-foreground">
                {user?.name || "Akun Saya"}
              </p>
              <p className="text-[10px] leading-none text-muted-foreground font-medium">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/5" />
        <div className="p-1">
          <DropdownMenuItem className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5">
            <User className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Profil Akun</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2.5">
            <Settings className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-medium text-sm">Pengaturan</span>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-primary/5" />
        <div className="p-1">
          <DropdownMenuItem className="text-rose-500 rounded-xl focus:bg-rose-500/10 focus:text-rose-500 transition-colors cursor-pointer py-2.5">
            <LogOut className="mr-3 h-4 w-4 opacity-70" />
            <span className="font-bold text-sm">Keluar</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
