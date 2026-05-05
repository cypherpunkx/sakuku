import { FinancialSummarySkeleton } from "../_components/financial-summary-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      {/* Personalized Dashboard Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-80 bg-primary/10 rounded-xl" />
        <Skeleton className="h-5 w-96 bg-muted/40 rounded-lg mt-1" />
      </div>

      {/* Financial Summary Skeleton */}
      <FinancialSummarySkeleton />

      {/* 50/30/20 Insight Section Skeleton - REBUILT FOR PARITY */}
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-md w-full rounded-3xl overflow-hidden relative">
        <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-3xl" />
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-64 bg-primary/20 rounded-lg" />
              <Skeleton className="h-4 w-96 bg-muted/20 rounded-md" />
            </div>
            <Skeleton className="h-8 w-32 bg-background/50 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-border/40 bg-background/20 backdrop-blur-sm"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-24 bg-muted/20 rounded-md" />
                    <Skeleton className="size-8 rounded-full bg-muted/10" />
                  </div>
                  <Skeleton className="h-9 w-32 bg-muted/30 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full bg-muted/10 rounded-full" />
                    <Skeleton className="h-2 w-full bg-muted/5 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Summary Bar Skeleton */}
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
            <Skeleton className="size-10 rounded-full bg-primary/20 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48 bg-muted/20 rounded-md" />
              <Skeleton className="h-4 w-full bg-muted/10 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Navigation Section Skeleton */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 px-1 border-b border-border/10">
          <div className="flex gap-2">
            <Skeleton className="h-12 w-36 rounded-xl bg-rose-500/10" />
            <Skeleton className="h-12 w-32 rounded-xl bg-muted/20" />
            <Skeleton className="h-12 w-32 rounded-xl bg-muted/20" />
            <Skeleton className="h-12 w-32 rounded-xl bg-muted/20" />
          </div>
          <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/40">
            <Skeleton className="h-8 w-20 rounded-xl bg-background/50" />
            <Skeleton className="h-8 w-20 rounded-xl bg-transparent" />
            <Skeleton className="h-8 w-20 rounded-xl bg-transparent" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Row 1: Prioritas & Distribusi */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Prioritas Pengeluaran Skeleton */}
            <Card className="lg:col-span-2 border-border/40 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
                <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-20 w-full rounded-2xl bg-muted/10" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <Skeleton
                          key={j}
                          className="h-4 w-full bg-muted/5 rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Distribusi Pengeluaran Skeleton */}
            <Card className="border-border/40 bg-card/30 backdrop-blur-md">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
                <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[240px]">
                <Skeleton className="size-44 rounded-full border-16 border-muted/5 bg-transparent" />
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Detail Transaksi & Tips */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Detail Transaksi Skeleton */}
            <Card className="md:col-span-2 border-border/40 bg-card/30 backdrop-blur-md">
              <CardHeader className="flex flex-col space-y-6 pb-6">
                <div>
                  <Skeleton className="h-7 w-48 bg-muted/20 rounded-lg" />
                  <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1 rounded-xl bg-muted/10" />
                  <Skeleton className="h-10 w-40 rounded-xl bg-muted/10" />
                  <Skeleton className="h-10 w-32 rounded-xl bg-muted/10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Skeleton className="size-10 rounded-xl bg-muted/10" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40 bg-muted/10 rounded-md" />
                          <Skeleton className="h-3 w-24 bg-muted/5 rounded-md" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-24 bg-muted/10 rounded-md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Hemat Skeleton */}
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm relative overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-32 bg-primary/10 rounded-lg" />
                <Skeleton className="h-4 w-48 bg-muted/10 rounded-md mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl bg-background/40" />
                <Skeleton className="h-16 w-full rounded-xl bg-background/40" />
                <Skeleton className="h-10 w-full rounded-xl bg-primary/20" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
