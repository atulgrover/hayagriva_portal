import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-semibold shadow-xs border border-transparent",
      destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 shadow-xs",
      outline: "border border-border bg-background shadow-xs hover:bg-secondary/70 hover:text-foreground text-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-foreground underline-offset-4 hover:underline font-medium",
      gold: "bg-secondary text-foreground font-semibold hover:bg-secondary/80 shadow-xs border border-border",
    };

    const sizeClasses = {
      default: "h-9 px-4 py-2 rounded-md text-xs font-semibold",
      sm: "h-8 rounded-md px-3 text-xs font-medium",
      lg: "h-10 rounded-md px-6 text-sm font-semibold",
      icon: "h-9 w-9 rounded-md",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
