import { Switch as ArkSwitch } from "@ark-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const switchVariants = cva(
  "x:inline-flex x:shrink-0 x:cursor-pointer x:items-center x:rounded-full x:bg-muted-foreground/35 x:transition-all x:focus-visible:ring-1 x:focus-visible:ring-ring x:focus-visible:ring-offset-2 x:focus-visible:ring-offset-background x:focus-visible:outline-none x:data-disabled:cursor-not-allowed x:data-disabled:opacity-50 x:data-[state=checked]:bg-primary/85 x:[&>span]:transition-all x:[&>span]:duration-150",
  {
    variants: {
      size: {
        xs: "x:h-4 x:w-7",
        sm: "x:h-5 x:w-9",
        base: "x:h-6 x:w-11",
        lg: "x:h-7 x:w-[52px]",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const thumbVariants = cva(
  "x:pointer-events-none x:block x:rounded-full x:bg-background x:shadow-lg x:ring-0 x:dark:bg-foreground",
  {
    variants: {
      size: {
        xs: "x:h-2.5 x:w-2.5 x:data-[state=checked]:translate-x-[15px] x:data-[state=unchecked]:translate-x-[3px]",
        sm: "x:h-3.5 x:w-3.5 x:data-[state=checked]:translate-x-[18px] x:data-[state=unchecked]:translate-x-1",
        base: "x:h-4 x:w-4 x:data-[state=checked]:translate-x-6 x:data-[state=unchecked]:translate-x-1",
        lg: "x:h-5 x:w-5 x:data-[state=checked]:translate-x-[27px] x:data-[state=unchecked]:translate-x-0.5",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

const labelVariants = cva(
  "x:cursor-pointer x:transition-colors x:duration-15 x:data-disabled:cursor-not-allowed x:data-disabled:opacity-50 x:data-[state=unchecked]:text-muted-foreground x:hover:data-[state=unchecked]:text-foreground",
  {
    variants: {
      size: {
        xs: "x:text-[10px]",
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

type SwitchProps = ArkSwitch.RootProps &
  VariantProps<typeof switchVariants> & {
    labelClassName?: string;
    textLabel?: ReactNode;
  };

export function Switch({
  textLabel,
  labelClassName,
  className,
  size,
  ...props
}: SwitchProps) {
  return (
    <ArkSwitch.Root
      className={cn("x:flex x:items-center x:gap-2", className)}
      {...props}
    >
      <ArkSwitch.Context>
        {function SwitchContext({ checked }) {
          return (
            <>
              <ArkSwitch.Control className={switchVariants({ size })}>
                <ArkSwitch.Thumb className={thumbVariants({ size })} />
              </ArkSwitch.Control>
              {textLabel != null && textLabel !== "" && (
                <ArkSwitch.Label
                  className={cn(
                    labelVariants({ size }),
                    {
                      "x:text-primary": checked,
                    },
                    labelClassName,
                  )}
                >
                  {textLabel}
                </ArkSwitch.Label>
              )}
              <ArkSwitch.HiddenInput />
            </>
          );
        }}
      </ArkSwitch.Context>
    </ArkSwitch.Root>
  );
}
