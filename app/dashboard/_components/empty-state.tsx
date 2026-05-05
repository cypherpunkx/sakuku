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
        "flex flex-col items-center justify-center text-center p-8 space-y-4 w-full",
        className
      )}
    >
      {Icon && (
        <div className={cn("p-4 rounded-3xl bg-muted/10 border border-border/40 opacity-40", iconClassName)}>
          <Icon className="size-12" />
        </div>
      )}
      <div className="space-y-1 flex flex-col items-center w-full">
        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-muted-foreground/80 text-center w-full">
          {title}
        </h3>
        {description && (
          <p className="text-sm font-medium text-muted-foreground/70 max-w-[400px] text-center w-full">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
