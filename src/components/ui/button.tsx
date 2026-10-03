import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Variant definitions matching explicit theme palette
// ---------------------------------------------------------------------------

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

const variantStyles = {
  primary:
    "bg-primary-teal text-white shadow-md hover:opacity-95 focus-visible:ring-primary-teal glow-teal border border-primary-teal/30",
  emerald:
    "bg-emerald-accent text-white shadow-md hover:opacity-95 focus-visible:ring-emerald-accent glow-emerald border border-emerald-accent/30",
  violet:
    "bg-violet-accent text-white shadow-md hover:opacity-95 focus-visible:ring-violet-accent glow-violet border border-violet-accent/30",
  coral:
    "bg-coral-accent text-white shadow-md hover:opacity-95 focus-visible:ring-coral-accent glow-coral border border-coral-accent/30",
  secondary:
    "bg-muted-bg text-fg-app border border-surface-border shadow-xs hover:bg-surface-card-hover focus-visible:ring-primary-teal",
  outline:
    "border border-surface-border bg-surface-card/60 text-fg-app shadow-xs hover:border-luminous hover:bg-surface-card-hover focus-visible:ring-primary-teal",
  ghost:
    "text-fg-app hover:bg-muted-bg focus-visible:ring-primary-teal",
  destructive:
    "bg-red-600 text-white shadow-md hover:bg-red-700 focus-visible:ring-red-600",
} as const;

const sizeStyles = {
  sm: "h-9 px-3.5 text-xs rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-13 px-7 text-base rounded-2xl",
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
