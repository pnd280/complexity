import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "x:inline-flex x:cursor-default x:items-center x:rounded-md x:border x:border-border/50 x:px-2.5 x:py-0.5 x:text-xs x:font-semibold x:transition-colors x:focus:ring-2 x:focus:ring-ring x:focus:ring-offset-2 x:focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "x:border-transparent x:bg-primary x:text-primary-foreground x:hover:bg-primary/80",
        secondary:
          "x:border-transparent x:bg-secondary x:text-secondary-foreground x:hover:bg-secondary/80",
        caution:
          "x:border-transparent x:bg-caution x:text-caution-foreground x:hover:bg-caution/80",
        outline: "x:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
