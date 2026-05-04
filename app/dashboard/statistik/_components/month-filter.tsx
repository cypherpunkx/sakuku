"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { format, subMonths, addMonths, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface MonthFilterProps {
  currentMonth: string; // YYYY-MM
}

export function MonthFilter({ currentMonth }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date = parseISO(`${currentMonth}-01`);

  const handleMonthChange = (newDate: Date) => {
    const monthStr = format(newDate, "yyyy-MM");
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", monthStr);
    router.push(`/dashboard/statistik?${params.toString()}`);
  };

  const prevMonth = () => handleMonthChange(subMonths(date, 1));
  const nextMonth = () => handleMonthChange(addMonths(date, 1));

  return (
    <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md border border-border/40 p-1.5 rounded-2xl shadow-xl">
      <Button
        variant="ghost"
        size="icon"
        onClick={prevMonth}
        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-2 px-4 py-1 min-w-[160px] justify-center">
        <Calendar className="size-4 text-primary opacity-60" />
        <span className="text-sm font-black tracking-tight capitalize">
          {format(date, "MMMM yyyy", { locale: id })}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
        className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
