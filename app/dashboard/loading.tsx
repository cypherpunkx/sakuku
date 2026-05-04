import { FinancialSummarySkeleton } from "./_components/financial-summary-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      {/* Personalized Dashboard Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64 bg-primary/10 rounded-xl" />
        <Skeleton className="h-5 w-96 bg-muted/40 rounded-lg" />
      </div>

      {/* Financial Summary Skeleton */}
      <FinancialSummarySkeleton />

      {/* 50/30/20 Insight Section Skeleton */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-md w-full rounded-3xl overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
           <Skeleton className="size-24 rounded-full bg-primary/10 shrink-0" />
           <div className="flex-1 w-full space-y-4">
              <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
              <div className="grid grid-cols-3 gap-4">
                 <Skeleton className="h-12 w-full bg-muted/10 rounded-xl" />
                 <Skeleton className="h-12 w-full bg-muted/10 rounded-xl" />
                 <Skeleton className="h-12 w-full bg-muted/10 rounded-xl" />
              </div>
           </div>
        </div>
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
          <Skeleton className="h-10 w-48 rounded-xl bg-muted/20" />
        </div>
        
        {/* Expense Tab Content Skeleton */}
        <div className="grid gap-6 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Distribusi Pengeluaran Skeleton */}
           <Card className="lg:col-span-3 border-border/40 bg-card/30 backdrop-blur-md rounded-[24px] overflow-hidden">
             <CardHeader className="border-b border-border/10 pb-4">
               <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
               <Skeleton className="h-4 w-64 bg-muted/10 rounded-md mt-1" />
             </CardHeader>
             <CardContent className="p-6 flex flex-col items-center justify-center gap-8 min-h-[400px]">
               <Skeleton className="size-48 rounded-full bg-muted/10" />
               <div className="w-full space-y-3">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex justify-between items-center w-full">
                     <Skeleton className="h-4 w-24 bg-muted/20 rounded-md" />
                     <Skeleton className="h-4 w-20 bg-muted/10 rounded-md" />
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           {/* Riwayat Transaksi Skeleton */}
           <Card className="lg:col-span-4 border-border/40 bg-card/30 backdrop-blur-md rounded-[24px] overflow-hidden">
             <CardHeader className="border-b border-border/10 pb-4 flex flex-row items-center justify-between">
               <div>
                 <Skeleton className="h-6 w-40 bg-muted/20 rounded-lg" />
                 <Skeleton className="h-4 w-56 bg-muted/10 rounded-md mt-1" />
               </div>
               <Skeleton className="h-9 w-24 bg-muted/20 rounded-xl" />
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-border/5">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-4">
                       <Skeleton className="size-12 rounded-xl bg-muted/20" />
                       <div className="space-y-2">
                         <Skeleton className="h-5 w-40 bg-muted/20 rounded-md" />
                         <Skeleton className="h-4 w-24 bg-muted/10 rounded-md" />
                       </div>
                     </div>
                     <Skeleton className="h-6 w-28 bg-muted/20 rounded-lg" />
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
      </section>
    </div>
  );
}
