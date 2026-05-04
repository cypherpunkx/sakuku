import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialSummarySkeleton() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-8 w-8 rounded-xl bg-white/5" />
          </CardHeader>
          <CardContent className="pt-2">
            <Skeleton className="h-9 w-40 bg-white/5 mb-3" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded-full bg-white/5" />
              <Skeleton className="h-3 w-32 bg-white/5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
