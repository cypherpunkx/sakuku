import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StatistikLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-64 bg-primary/10 rounded-xl" />
          <Skeleton className="h-5 w-96 bg-muted/40 rounded-lg" />
        </div>
        
        {/* Month Filter Skeleton */}
        <Skeleton className="h-10 w-full md:w-64 bg-muted/20 rounded-xl" />
      </div>

      <div className="space-y-8">
        {/* Overview Cards Skeleton (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
             <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <Skeleton className="h-3 w-24 bg-muted/20 rounded-md" />
                  <Skeleton className="h-8 w-40 bg-muted/30 rounded-lg mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-5 w-32 bg-muted/10 rounded-full" />
                </CardContent>
             </Card>
          ))}
        </div>

        {/* AI Forecast Skeleton */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-xl relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16 bg-primary rounded-md" />
                  <Skeleton className="h-4 w-48 bg-primary/20 rounded-md" />
                </div>
                <Skeleton className="h-7 w-64 bg-muted/20 rounded-lg" />
                <Skeleton className="h-4 w-full max-w-lg bg-muted/10 rounded-md" />
              </div>
              <Skeleton className="size-16 rounded-2xl bg-primary/10" />
            </div>
          </CardContent>
        </Card>

        {/* Main Chart Skeleton */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-xl relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 bg-muted/20 rounded-lg" />
              <Skeleton className="h-4 w-64 bg-muted/10 rounded-md" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20 bg-emerald-500/10 rounded-full" />
              <Skeleton className="h-4 w-20 bg-rose-500/10 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="h-[400px] w-full pt-0 flex flex-col justify-end">
             <div className="w-full h-[300px] bg-muted/5 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent animate-pulse" />
                {/* Simulated Wave Path */}
                <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 300">
                  <path d="M0,150 C100,120 200,180 300,150 C400,120 500,180 600,150 C700,120 800,180 900,150 L1000,120 L1000,300 L0,300 Z" fill="currentColor" />
                </svg>
             </div>
             <div className="flex justify-between mt-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-3 w-12 bg-muted/20 rounded-md" />
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Categories Distribution Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border/40 bg-card/30 backdrop-blur-md">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
              <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Skeleton className="size-48 rounded-full bg-muted/10" />
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/30 backdrop-blur-md">
            <CardHeader>
              <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
              <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-muted/10 rounded-md" />
                    <Skeleton className="h-4 w-12 bg-muted/10 rounded-md" />
                  </div>
                  <Skeleton className="h-2 w-full bg-muted/5 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Heatmap Skeleton */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-6 w-56 bg-muted/20 rounded-lg" />
            <Skeleton className="h-4 w-80 bg-muted/10 rounded-md mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...Array(30)].map((_, i) => (
                <Skeleton key={i} className="size-8 md:size-10 rounded-lg bg-muted/10" />
              ))}
            </div>
            <div className="mt-8 flex justify-end gap-3 items-center">
              <Skeleton className="h-3 w-12 bg-muted/20 rounded-md" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="size-3 rounded-sm bg-muted/20" />
                ))}
              </div>
              <Skeleton className="h-3 w-12 bg-muted/20 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
