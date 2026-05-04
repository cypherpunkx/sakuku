import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 space-y-4",
        className
      )}
    >
      {Icon && (
        <div className={cn("p-4 rounded-3xl bg-muted/10 border border-border/40 opacity-40", iconClassName)}>
          <Icon className="size-12" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-muted-foreground/80">
          {title}
        </h3>
        {description && (
          <p className="text-sm font-medium text-muted-foreground/70 max-w-[280px] mx-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
