"use client";

import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  Settings,
  Wallet
} from "lucide-react";

const icons: Record<string, any> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/statistik": BarChart3,
  "/dashboard/edukasi": BookOpen,
  "/dashboard/settings": Settings,
};

export function HeaderIcon() {
  const pathname = usePathname();
  const Icon = icons[pathname] || Wallet;

  return (
    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
      <Icon className="size-5 text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
    </div>
  );
}
