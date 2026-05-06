"use client";

import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  Settings, 
  LogOut 
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import Link from "next/link";

const navItems = [
  {
    title: "Ringkasan",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Statistik",
    url: "/dashboard/statistik",
    icon: BarChart3,
  },
  {
    title: "Edukasi",
    url: "/dashboard/edukasi",
    icon: BookOpen,
  },
  {
    title: "Pengaturan",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
    : "AD";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-sidebar/80 backdrop-blur-xl"
    >
      <SidebarHeader className="h-16 flex items-center justify-center group-data-[collapsible=icon]:px-0 px-4">
        <div className="flex items-center gap-3 font-bold text-xl transition-all duration-300 group-data-[collapsible=icon]:gap-0">
          <div 
            className="size-9 rounded-xl bg-gradient-premium shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground transform group-hover:rotate-6 transition-transform shrink-0"
            aria-label="Logo SakuKu"
          >
            <span className="text-lg font-black italic">S</span>
          </div>
          <span className="group-data-[collapsible=icon]:hidden tracking-tight text-gradient-primary">
            SakuKu
          </span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/90 mb-2 group-data-[collapsible=icon]:hidden">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item: any) => {
              const isActive = item.url === "/dashboard" 
                ? (pathname === "/dashboard" || pathname === "/dashboard/")
                : pathname?.startsWith(item.url);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "relative overflow-hidden transition-all duration-300 group/nav-item",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "hover:bg-primary/5",
                    )}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 py-3 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
                      aria-label={`Buka halaman ${item.title}`}
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <item.icon
                          className={cn(
                            "size-5 transition-all duration-300",
                            isActive
                              ? "text-primary scale-110"
                              : "text-muted-foreground group-hover/nav-item:text-primary group-hover/nav-item:scale-110",
                          )}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "font-semibold transition-colors group-data-[collapsible=icon]:hidden",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover/nav-item:text-foreground",
                        )}
                      >
                        {item.title}
                      </span>

                      {/* Active Indicator Line */}
                      <div
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-500",
                          isActive
                            ? "h-1/2 bg-primary shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                            : "h-0 bg-primary/40 group-hover/nav-item:h-1/4",
                          "group-data-[collapsible=icon]:hidden",
                        )}
                      />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              aria-label="Profil Pengguna dan Pengaturan"
              className="rounded-xl border border-border/40 bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-all"
            >
              <Avatar className="h-9 w-9 rounded-lg border border-primary/20">
                <AvatarImage 
                  src={user?.image || "https://github.com/shadcn.png"} 
                  alt={user?.name || "User Avatar"} 
                />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                  {user?.name?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                <span className="truncate font-black text-foreground">
                  {user?.name || "Admin SakuKu"}
                </span>
                <span className="truncate text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                  Premium Member
                </span>
              </div>
              <Settings className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <form action={async () => {
              const { signOut } = await import("@/lib/actions/auth.actions");
              await signOut();
            }}>
              <SidebarMenuButton 
                type="submit"
                aria-label="Keluar dari akun"
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl font-bold py-5 transition-all mt-2 w-full"
              >
                <LogOut className="size-4 mr-2" />
                Keluar
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
