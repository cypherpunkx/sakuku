import { ThemeShowcase } from "@/components/theme-showcase";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-4 flex flex-col gap-8">
        <header className="flex flex-col gap-4 items-center text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            SakuKu Finance
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl">
            Atur keuangan pribadi Anda dengan lebih cerdas dan estetis.
          </p>
          <div className="flex gap-4 mt-4">
            <Button asChild size="lg" className="rounded-full px-8">
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              asChild
            >
              <a href="https://ui.shadcn.com/docs/components" target="_blank">
                Shadcn Docs
              </a>
            </Button>
          </div>
        </header>

        <ThemeShowcase />
      </div>
    </main>
  );
}
