import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "emerald";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "border-border bg-secondary text-foreground hover:bg-secondary/80",
    secondary: "border-border/60 bg-secondary/50 text-muted-foreground",
    destructive: "border-destructive/30 bg-destructive/10 text-destructive",
    outline: "border-border text-foreground bg-transparent",
    gold: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono",
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none tracking-tight",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
