import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary hover:bg-primary/30 border-primary/30",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/20 text-destructive border-destructive/30",
        outline: "text-foreground border-border",
        success:
          "border-transparent bg-accent/20 text-accent border-accent/30",
        warning:
          "border-transparent bg-warning/20 text-warning border-warning/30",
        highMatch:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono shadow-[0_0_10px_rgba(16,185,129,0.15)]",
        medMatch:
          "border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono",
        lowMatch:
          "border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
