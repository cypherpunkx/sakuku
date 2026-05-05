import { Suspense } from "react";
import { AppSidebar } from "./_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";

import { getUser } from "@/lib/actions";
import { HeaderTitle } from "./_components/header-title";
import { HeaderIcon } from "./_components/header-icon";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Suspense
        fallback={
          <div className="w-64 h-full bg-muted/20 animate-pulse border-r border-border/40" />
        }
      >
        <AppSidebar user={user} />
      </Suspense>
      <SidebarInset className="relative overflow-hidden bg-background">
        {/* Premium Background Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[80px] rounded-full" />
        </div>

        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 relative z-10 bg-background/60 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className="-ml-1 hover:bg-primary/10 transition-colors"
              aria-label="Buka/Tutup Sidebar"
            />
            <Separator orientation="vertical" className="mr-2 h-4 opacity-40" />
            <div className="flex items-center gap-2.5 group">
              <HeaderIcon />
              <HeaderTitle />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <CommandMenu /> */}
            {/* <UserNav user={user} /> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 relative z-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
