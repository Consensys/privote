import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const chipVariants = cva(
  "py-2 px-3 text-xs h-fit rounded-md inline-block whitespace-nowrap text-center bg-lime-200 text-lime-600 align-baseline font-bold uppercase leading-none",
  {
    variants: {
      variant: {
        default: "bg-green-200 text-green-600",
        success: "bg-green-200 text-green-600",
        warning: "bg-yellow-200 text-yellow-600",
        danger: "bg-red-200 text-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.HtmlHTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  asChild?: boolean;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        className={cn(chipVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
