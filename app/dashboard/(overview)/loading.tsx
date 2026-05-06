import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      {/* Minimal Header Placeholder */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-10 w-64 bg-primary/10 rounded-xl" />
        <Skeleton className="h-5 w-80 bg-muted/20 rounded-lg" />
      </div>

      {/* Basic Content Shell - This will be quickly replaced by page.tsx Suspense fallbacks */}
      <div className="space-y-8">
        <Skeleton className="h-[180px] w-full rounded-[32px] bg-muted/5 border border-border/10" />
        <Skeleton className="h-[120px] w-full rounded-3xl bg-muted/5" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl bg-muted/10" />
          <Skeleton className="h-[400px] w-full rounded-[32px] bg-muted/5" />
        </div>
      </div>
    </div>
  );
}
