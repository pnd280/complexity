import { Checkbox as ArkCheckbox } from "@ark-ui/react/checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import TablerCheck from "~icons/tabler/check";

const checkboxVariants = cva(
  "x:shrink-0 x:rounded-sm x:border x:border-border x:ring-offset-background x:transition-all x:group-data-disabled:cursor-not-allowed x:group-data-disabled:opacity-50 x:focus-visible:ring-2 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:outline-none x:data-[state=checked]:bg-primary x:data-[state=checked]:text-foreground-subtle",
  {
    variants: {
      size: {
        sm: "x:size-3.5",
        base: "x:size-4.5",
        lg: "x:size-5.5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const labelVariants = cva(
  "x:text-sm x:leading-none x:font-medium x:text-muted-foreground x:group-data-disabled:cursor-not-allowed x:group-data-disabled:opacity-70",
  {
    variants: {
      size: {
        sm: "x:text-xs",
        base: "x:text-sm",
        lg: "x:text-base",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

type CheckboxProps = ArkCheckbox.RootProps &
  VariantProps<typeof checkboxVariants> & {
    label?: ReactNode;
    labelClassName?: string;
  };

export function Checkbox({
  label,
  labelClassName,
  className,
  size,
  ...props
}: CheckboxProps) {
  return (
    <ArkCheckbox.Root
      className={cn("x:group x:flex x:items-baseline x:gap-2", className)}
      {...props}
    >
      <ArkCheckbox.Control className={cn(checkboxVariants({ size }))}>
        <ArkCheckbox.Indicator>
          <TablerCheck className="x:size-full x:text-background x:dark:text-foreground" />
        </ArkCheckbox.Indicator>
      </ArkCheckbox.Control>
      {label != null && label !== "" && (
        <ArkCheckbox.Label
          className={cn(labelVariants({ size }), labelClassName)}
        >
          {label}
        </ArkCheckbox.Label>
      )}
      <ArkCheckbox.HiddenInput />
    </ArkCheckbox.Root>
  );
}
