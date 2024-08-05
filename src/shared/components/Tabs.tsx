import { Tabs as ArkTabs, useTabsContext } from "@ark-ui/react";
import { ElementRef, forwardRef } from "react";

import { cn } from "@/utils/cn";

const Tabs = ArkTabs.Root;

const TabsTrigger = forwardRef<
  ElementRef<typeof ArkTabs.Trigger>,
  ArkTabs.TriggerProps
>(({ value, className, ...props }, ref) => {
  const { value: selectedValue } = useTabsContext();

  return (
    <ArkTabs.Trigger
      ref={ref}
      value={value}
      className={cn(
        "tw-inline-flex tw-items-center tw-justify-center tw-whitespace-nowrap tw-rounded-sm tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-all focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50",
        "data-[state=active]:tw-bg-background data-[state=active]:tw-text-foreground data-[state=active]:tw-shadow-sm",
        className,
      )}
      data-state={selectedValue === value ? "active" : undefined}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsList = forwardRef<ElementRef<typeof ArkTabs.List>, ArkTabs.ListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ArkTabs.List
        ref={ref}
        className={cn(
          "tw-inline-flex tw-h-10 tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-p-1 tw-text-muted-foreground",
          className,
        )}
        {...props}
      ></ArkTabs.List>
    );
  },
);

TabsList.displayName = "TabsList";

const TabsContent = forwardRef<
  ElementRef<typeof ArkTabs.Content>,
  ArkTabs.ContentProps
>(({ className, ...props }, ref) => {
  return (
    <ArkTabs.Content
      ref={ref}
      className={cn(
        "tw-mt-2 tw-ring-offset-background focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2",
        className,
      )}
      {...props}
    ></ArkTabs.Content>
  );
});

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
