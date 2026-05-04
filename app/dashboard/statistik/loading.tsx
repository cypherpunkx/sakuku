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

      <section className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
             <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24 bg-muted/20" />
                  <Skeleton className="size-8 bg-muted/20 rounded-full" />
                </CardHeader>
                <CardContent className="pt-2">
                  <Skeleton className="h-8 w-32 bg-muted/20 mb-2" />
                  <Skeleton className="h-3 w-40 bg-muted/10" />
                </CardContent>
             </Card>
          ))}
        </div>

        {/* Main Chart Skeleton */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-[24px] overflow-hidden">
          <CardHeader className="border-b border-border/10 pb-6">
            <Skeleton className="h-7 w-64 bg-muted/20 rounded-lg" />
            <Skeleton className="h-4 w-96 bg-muted/10 rounded-md mt-2" />
          </CardHeader>
          <CardContent className="p-6 h-[400px] flex items-end gap-2">
             {[...Array(30)].map((_, i) => (
               <Skeleton 
                 key={i} 
                 className="w-full bg-primary/20 rounded-t-sm" 
                 style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
               />
             ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Sub Charts Skeleton */}
          {[1, 2].map((i) => (
             <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-md rounded-[24px] overflow-hidden">
               <CardHeader className="border-b border-border/10 pb-4">
                 <Skeleton className="h-6 w-48 bg-muted/20 rounded-lg" />
               </CardHeader>
               <CardContent className="p-6 h-[300px] flex justify-center items-center">
                  <Skeleton className="size-48 rounded-full bg-muted/10" />
               </CardContent>
             </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
