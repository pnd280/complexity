import { RadioGroup as ArkRadioGroup } from "@ark-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const radioGroupVariants = cva("x:flex x:gap-2", {
  variants: {
    orientation: {
      horizontal: "x:flex-row",
      vertical: "x:flex-col",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const radioItemVariants = cva(
  "x:group x:flex x:cursor-pointer x:items-start x:gap-2 x:data-disabled:cursor-not-allowed x:data-disabled:opacity-50",
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

const radioControlVariants = cva(
  "x:mt-1 x:flex x:aspect-square x:size-4 x:items-center x:justify-center x:rounded-full x:border x:border-border x:transition-all x:group-data-[disabled]:opacity-50 x:group-data-[state=checked]:border-primary x:group-data-[state=checked]:text-primary-foreground",
  {
    variants: {
      size: {
        sm: "x:size-3",
        base: "x:size-4",
        lg: "x:size-5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const radioIndicatorVariants = cva("x:size-2 x:rounded-full x:bg-primary", {
  variants: {
    size: {
      sm: "x:size-1.5",
      base: "x:size-2",
      lg: "x:size-2.5",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

const radioLabelVariants = cva(
  "x:text-sm x:font-medium x:text-muted-foreground x:group-data-[disabled]:opacity-70 x:group-data-[state=checked]:text-foreground",
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

type RadioRootProps = ArkRadioGroup.RootProps &
  VariantProps<typeof radioGroupVariants> & {
    size?: VariantProps<typeof radioItemVariants>["size"];
  };

type RadioGroupSimpleProps = RadioRootProps & {
  label?: ReactNode;
  options: { value: string; label: ReactNode }[];
};

export function RadioGroup({
  label,
  options,
  className,
  orientation,
  size,
  ...props
}: RadioGroupSimpleProps) {
  return (
    <ArkRadioGroup.Root
      className={cn(radioGroupVariants({ orientation }), className)}
      {...props}
    >
      {label != null && (
        <RadioLabel className="x:text-sm x:font-medium">{label}</RadioLabel>
      )}

      {options.map((option) => (
        <RadioItem
          key={option.value}
          value={option.value}
          className={cn(radioItemVariants({ size }))}
        >
          <RadioItemControl size={size}>
            <RadioIndicator size={size} />
          </RadioItemControl>
          <RadioItemText size={size}>{option.label}</RadioItemText>
          <RadioItemHiddenInput />
        </RadioItem>
      ))}
    </ArkRadioGroup.Root>
  );
}

export function RadioRoot({
  className,
  orientation,
  size: _size, // We don't use this directly in Root, but it's passed to context
  ...props
}: RadioRootProps) {
  return (
    <ArkRadioGroup.Root
      className={cn(radioGroupVariants({ orientation }), className)}
      {...props}
    />
  );
}

type RadioItemProps = ArkRadioGroup.ItemProps &
  VariantProps<typeof radioItemVariants> & {
    className?: string;
  };

export function RadioItem({ className, size, ...props }: RadioItemProps) {
  return (
    <ArkRadioGroup.Item
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    />
  );
}

export function RadioItemControl({
  className,
  size,
  ...props
}: ComponentProps<typeof ArkRadioGroup.ItemControl> &
  VariantProps<typeof radioControlVariants>) {
  return (
    <ArkRadioGroup.ItemControl
      className={cn(radioControlVariants({ size }), className)}
      {...props}
    />
  );
}

export function RadioIndicator({
  className,
  size,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  className?: string;
  size?: VariantProps<typeof radioIndicatorVariants>["size"];
}) {
  return (
    <div
      className={cn(
        radioIndicatorVariants({ size }),
        "x:scale-0 x:opacity-0 x:transition-all x:duration-200 x:group-data-[state=checked]:scale-100 x:group-data-[state=checked]:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export function RadioItemText({
  className,
  size,
  ...props
}: ComponentProps<typeof ArkRadioGroup.ItemText> &
  VariantProps<typeof radioLabelVariants>) {
  return (
    <ArkRadioGroup.ItemText
      className={cn(radioLabelVariants({ size }), className)}
      {...props}
    />
  );
}

export function RadioLabel({
  className,
  ...props
}: ComponentProps<typeof ArkRadioGroup.Label>) {
  return (
    <ArkRadioGroup.Label
      className={cn("x:text-sm x:font-medium", className)}
      {...props}
    />
  );
}

export const RadioItemHiddenInput = ArkRadioGroup.ItemHiddenInput;
