"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD string
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse string YYYY-MM-DD → Date (avoid timezone shift)
  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [value]);

  const handleSelect = (date?: Date) => {
    if (!date) return;
    const formatted = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    onChange?.(formatted);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          className={cn(
            // Base layout
            "w-full h-12 justify-start text-left font-bold rounded-xl",
            // Midnight Premium style
            "bg-muted/10 border-white/10 hover:bg-muted/20 hover:border-white/20",
            "focus-visible:ring-primary/30 focus-visible:border-primary/50",
            // Empty state
            "data-[empty=true]:text-muted-foreground/50",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4 text-muted-foreground/60 shrink-0" />
          {selected
            ? format(selected, "d MMMM yyyy", { locale: id })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#141417]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/40 rounded-2xl overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
