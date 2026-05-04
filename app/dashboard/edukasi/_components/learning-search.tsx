"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function LearningSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const debouncedValue = useDebounce(value, 500);

  // Sync internal state with URL changes (e.g. back/forward button)
  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("q") || "";
    if (debouncedValue === currentSearch) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      router.push(`/dashboard/edukasi?${params.toString()}`, { scroll: false });
    });
  }, [debouncedValue, router, searchParams]);

  return (
    <div className="w-full max-w-md relative group">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 size-5 transition-colors ${isPending ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"}`}
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari tips hemat, investasi, atau video..."
        className="w-full h-14 pl-12 pr-4 bg-background/60 backdrop-blur-xl border-border/40 rounded-2xl shadow-2xl shadow-indigo-500/10 focus-visible:ring-primary/30 text-base"
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
