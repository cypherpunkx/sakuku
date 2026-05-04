import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function EdukasiLoading() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-10 pb-20 animate-in fade-in duration-500">
      {/* Premium Hero Section Skeleton */}
      <section className="relative overflow-hidden rounded-[32px] bg-indigo-600/10 border border-indigo-500/20 p-8 md:p-12 h-[350px] flex flex-col items-center justify-center text-center space-y-6">
        <Skeleton className="h-6 w-48 bg-indigo-500/20 rounded-full" />
        <Skeleton className="h-12 w-3/4 max-w-2xl bg-indigo-500/20 rounded-2xl" />
        <Skeleton className="h-12 w-2/4 max-w-lg bg-indigo-500/20 rounded-2xl" />
        <Skeleton className="h-6 w-full max-w-xl bg-muted/20 rounded-lg mt-4" />
        <Skeleton className="h-14 w-full max-w-md bg-muted/20 rounded-2xl mt-4" />
      </section>

      {/* Tabs and Content Skeleton */}
      <div className="space-y-6">
        {/* Tabs List */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 bg-primary/20 rounded-xl" />
          <Skeleton className="h-10 w-32 bg-muted/20 rounded-xl" />
        </div>

        {/* Featured/Recommended Skeleton */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col md:flex-row h-auto md:h-[300px]">
          <Skeleton className="w-full md:w-[40%] h-[200px] md:h-full bg-muted/20" />
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-4">
            <Skeleton className="h-6 w-24 bg-primary/20 rounded-full" />
            <Skeleton className="h-8 w-3/4 bg-muted/20 rounded-lg" />
            <Skeleton className="h-4 w-full bg-muted/10 rounded-md" />
            <Skeleton className="h-4 w-full bg-muted/10 rounded-md" />
            <Skeleton className="h-4 w-2/3 bg-muted/10 rounded-md" />
            <div className="flex items-center gap-4 mt-4">
              <Skeleton className="h-10 w-32 bg-primary/20 rounded-xl" />
              <Skeleton className="size-10 bg-muted/20 rounded-full" />
            </div>
          </div>
        </Card>

        {/* Grid Skeleton for other articles */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/40 bg-card/30 backdrop-blur-md overflow-hidden rounded-[24px] h-[380px] flex flex-col">
              <Skeleton className="h-[180px] w-full bg-muted/20 shrink-0" />
              <CardHeader className="p-5 pb-0 flex-1">
                <Skeleton className="h-5 w-24 bg-muted/20 rounded-full mb-3" />
                <Skeleton className="h-6 w-full bg-muted/20 rounded-lg mb-2" />
                <Skeleton className="h-6 w-3/4 bg-muted/20 rounded-lg" />
              </CardHeader>
              <CardFooter className="p-5 pt-0 flex justify-between items-center shrink-0">
                <Skeleton className="h-4 w-20 bg-muted/20 rounded-md" />
                <div className="flex gap-2">
                  <Skeleton className="size-8 bg-muted/20 rounded-full" />
                  <Skeleton className="size-8 bg-muted/20 rounded-full" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
