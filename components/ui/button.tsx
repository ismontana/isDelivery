import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-capsule text-sm font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-40 tap-target",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-base text-white shadow-glass-sm hover:bg-primary-accent",
        glass:
          "glass glass-shadow text-ink hover:bg-white/10 dark:hover:bg-white/5",
        ghost: "text-ink-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5",
        outline: "border border-border text-ink hover:bg-black/5 dark:hover:bg-white/5",
        danger: "bg-danger text-white hover:opacity-90",
        icon: "glass glass-shadow text-ink hover:bg-white/10 dark:hover:bg-white/5",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 shrink-0",
        "icon-sm": "h-9 w-9 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
