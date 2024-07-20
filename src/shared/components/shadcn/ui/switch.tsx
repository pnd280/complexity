import * as React from 'react';

import { cn } from '@/utils/shadcn-ui-utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'tw-peer tw-inline-flex tw-h-6 tw-w-11 tw-shrink-0 tw-cursor-pointer tw-items-center tw-rounded-full tw-border-[1px] tw-border-transparent tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-background disabled:tw-cursor-not-allowed disabled:tw-opacity-50 tw-bg-transparent [&>span]:hover:tw-scale-95 [&>span]:tw-transition-all [&>span]:tw-duration-150',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'tw-pointer-events-none tw-block tw-h-4 tw-w-4 tw-rounded-full tw-bg-muted-foreground data-[state=checked]:tw-bg-accent-foreground tw-shadow-lg tw-ring-0 tw-transition-all data-[state=checked]:tw-translate-x-6 data-[state=unchecked]:tw-translate-x-1 tw-duration-150 tw-ease-in-out'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
