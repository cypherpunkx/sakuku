"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Plus,
  Target,
  Receipt,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted/20 border border-border/40 rounded-xl hover:bg-muted/30 transition-all group"
      >
        <Search className="size-3.5 group-hover:text-primary transition-colors" />
        <span>Cari...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex ml-2 border-white/10 text-muted-foreground/50">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik perintah atau cari..." />
        <CommandList className="bg-background/80 backdrop-blur-xl">
          <CommandEmpty>Hasil tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Navigasi Cepat">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Ringkasan Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/statistik"))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Statistik & Analisis</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/edukasi"))}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Edukasi Finansial</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Aksi">
            <CommandItem onSelect={() => runCommand(() => {
              // Trigger modal via URL or a better state management if possible
              // For now, let's navigate to the tab
              router.push("/dashboard?tab=pengeluaran");
            })}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Catat Transaksi Baru</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard?tab=target"))}>
              <Target className="mr-2 h-4 w-4" />
              <span>Buat Target Tabungan</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard?tab=tagihan"))}>
              <Receipt className="mr-2 h-4 w-4" />
              <span>Tambah Tagihan</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pengaturan">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil Pengguna</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan Akun</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
