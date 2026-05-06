import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3 animate-in fade-in duration-500">
      {[...Array(3)].map((_, i) => (
        <Card
          key={i}
          className="border-border/40 bg-card/30 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden relative"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <Skeleton className="h-3 w-20" />
            <div className="p-2.5 rounded-xl bg-background/40 border border-border/40">
              <Skeleton className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-2">
            <Skeleton className="h-8 w-40 mb-2" />
            <div className="flex items-center gap-2 mt-2">
              <Skeleton className="h-4 w-12 rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </CardContent>
          <div className="absolute -right-8 -top-8 size-24 bg-primary/5 rounded-full blur-3xl" />
        </Card>
      ))}
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <Card className="border-primary/20 bg-primary/5 backdrop-blur-md rounded-3xl relative overflow-hidden animate-in fade-in duration-500">
      <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-3xl" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-4 p-5 rounded-[24px] bg-card/30 border border-white/5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="size-10 rounded-2xl" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-[28px] bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TabsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 border-b border-border/10">
        <div className="flex items-center gap-2 bg-muted/20 p-1.5 rounded-2xl border border-border/40 w-fit">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-1 bg-muted/20 p-1 rounded-2xl border border-border/40">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-xl" />
          ))}
        </div>
      </div>
      <TableTabSkeleton />
    </div>
  );
}

export function TableTabSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Mini Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Prioritas Pengeluaran Skeleton */}
        <Card className="lg:col-span-2 border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-[24px]" />
              <Skeleton className="h-24 w-full rounded-[24px]" />
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 px-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Skeleton */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[180px]">
            <div className="relative size-32 rounded-full border-12 border-muted/20 flex items-center justify-center">
              <div className="size-16 rounded-full border-12 border-muted/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/40 bg-card/30 backdrop-blur-md overflow-hidden">
          <CardHeader className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-40 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-6 w-28 ml-auto" />
                    <Skeleton className="h-3 w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Hemat Skeleton */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-md rounded-3xl h-fit">
          <CardHeader>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CardGridTabSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-md rounded-3xl h-48 flex items-center p-8">
        <div className="space-y-4 flex-1">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="size-20 rounded-2xl hidden md:block" />
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="border-border/40 bg-card/30 backdrop-blur-md rounded-2xl"
          >
            <CardHeader className="pb-2">
              <Skeleton className="size-10 rounded-xl mb-4" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function HealthTabSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-primary/5 backdrop-blur-md rounded-3xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Skeleton className="size-32 rounded-full shrink-0" />
              <div className="space-y-3 flex-1 w-full text-center md:text-left">
                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto md:mx-0" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-3xl">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-3xl">
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card
            key={i}
            className="border-border/40 bg-card/30 backdrop-blur-md rounded-2xl"
          >
            <CardHeader>
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
