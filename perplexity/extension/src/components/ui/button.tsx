import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "x:inline-flex x:items-center x:justify-center x:rounded-lg x:font-sans x:text-sm x:font-medium x:whitespace-nowrap x:ring-offset-background x:transition-all x:duration-300 x:ease-in-out x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:active:scale-95 x:disabled:pointer-events-none x:disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "x:bg-primary-foreground x:text-foreground x:hover:text-muted-foreground",
        destructive:
          "x:bg-destructive x:text-destructive-foreground x:hover:bg-destructive/90",
        outline:
          "x:border x:border-border/50 x:bg-transparent x:text-muted-foreground x:hover:text-foreground",
        primary:
          "x:bg-primary x:text-white x:hover:bg-primary/80 x:dark:text-primary-foreground",
        secondary:
          "x:bg-secondary x:text-secondary-foreground x:hover:bg-secondary/80",
        ghost:
          "x:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground",
        ghostNoOutline:
          "x:rounded-none x:text-muted-foreground x:hover:text-foreground",
        link: "x:text-primary x:underline-offset-4 x:hover:underline",
      },
      size: {
        default: "x:h-10 x:px-4 x:py-2",
        xs: "",
        sm: "x:h-9 x:px-3",
        lg: "x:h-11 x:px-8",
        icon: "x:h-10 x:w-10",
        iconSm: "x:h-8 x:w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
