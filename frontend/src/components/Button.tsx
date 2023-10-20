import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import Icon from "@/components/Icon";
import { cn } from "@/utils/classes";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      loading: {
        true: "pointer-events-none",
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
  loading?: boolean;
  icon?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      icon = "",
      asChild = false,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const iconClassName = cn(
      "h-4 w-4",
      size !== "icon" && "mr-3",
      loading && "animate-spin"
    );

    const getButtonContent = () => {
      if (size === "icon") {
        return (
          <>
            <Icon name={loading ? "Loader2" : icon} className={iconClassName} />
            {children}
          </>
        );
      }
      return (
        <>
          {loading && <Icon name="Loader2" className={iconClassName} />}
          {children}
        </>
      );
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {getButtonContent()}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export default Button;
export { buttonVariants };

// Check Icon List here: https://lucide.dev/icons/
