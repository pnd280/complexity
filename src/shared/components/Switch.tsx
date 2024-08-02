import { Switch as ArkSwitch } from "@ark-ui/react";
import { ElementRef, forwardRef } from "react";

import { cn } from "@/utils/cn";

const Switch = forwardRef<
  ElementRef<typeof ArkSwitch.Root>,
  ArkSwitch.RootProps & {
    labelClassName?: string;
    textLabel: string;
  }
>(({ textLabel, labelClassName, className, ...props }, ref) => {
  return (
    <ArkSwitch.Root
      ref={ref}
      className={cn("tw-flex tw-items-center tw-space-x-2", className)}
      {...props}
    >
      <ArkSwitch.Context>
        {({ checked }) => (
          <>
            <ArkSwitch.Control className="tw-inline-flex tw-h-6 tw-w-11 tw-shrink-0 tw-cursor-pointer tw-items-center tw-space-x-2 tw-rounded-full tw-border-[1px] tw-border-transparent tw-bg-transparent tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:tw-transition-all [&>span]:tw-duration-150 [&>span]:hover:tw-scale-95">
              <ArkSwitch.Thumb
                className={cn(
                  "tw-pointer-events-none tw-block tw-h-4 tw-w-4 tw-rounded-full tw-bg-muted-foreground tw-shadow-lg tw-ring-0",
                  "data-[state=checked]:tw-translate-x-6 data-[state=checked]:tw-bg-accent-foreground data-[state=checked]:tw-text-accent-foreground",
                  "data-[state=unchecked]:tw-translate-x-1",
                )}
              />
            </ArkSwitch.Control>
            <ArkSwitch.Label
              className={cn(
                "tw-duration-15 tw-text-sm tw-transition-colors",
                {
                  "tw-text-accent-foreground": checked,
                },
                labelClassName,
              )}
            >
              {textLabel}
            </ArkSwitch.Label>
            <ArkSwitch.HiddenInput />
          </>
        )}
      </ArkSwitch.Context>
    </ArkSwitch.Root>
  );
});

Switch.displayName = "Switch";

export default Switch;
