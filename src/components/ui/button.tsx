import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-soft hover:shadow-card rounded-xl active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl active:scale-[0.98]",
        outline: "border border-border bg-background hover:bg-secondary hover:border-border/80 rounded-xl active:scale-[0.98]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent border border-border/50 rounded-xl active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        // Premium Foster Care variants
        hero: "bg-primary text-primary-foreground px-8 py-4 text-base font-semibold hover:bg-primary-hover shadow-card hover:shadow-elevated hover:shadow-glow rounded-full active:scale-[0.98]",
        "hero-outline": "bg-card/80 backdrop-blur-sm text-foreground border border-border/60 hover:bg-secondary hover:border-primary/20 px-8 py-4 text-base font-medium rounded-full active:scale-[0.98]",
        pill: "bg-secondary text-secondary-foreground hover:bg-accent px-5 py-2 rounded-full border border-border/40 active:scale-[0.98]",
        warm: "bg-background-warm text-foreground hover:bg-accent border border-border/40 rounded-2xl active:scale-[0.98]",
        premium: "bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-card hover:shadow-elevated rounded-xl active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
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
