
"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Ringkasan",
  "/dashboard/statistik": "Statistik",
  "/dashboard/edukasi": "Edukasi Finansial",
  "/dashboard/settings": "Pengaturan",
};

export function HeaderTitle() {
  const pathname = usePathname();
  const title = titles[pathname] || "Dashboard";

  return (
    <span className="tracking-tight text-gradient-primary italic font-black text-xl pr-2 animate-in fade-in slide-in-from-left-2 duration-500">
      {title}
    </span>
  );
}
