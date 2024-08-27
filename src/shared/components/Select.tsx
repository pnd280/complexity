import { Portal, Select as ArkSelect } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import {
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  createContext,
  useContext,
} from "react";
import { LuChevronDown as ChevronDown } from "react-icons/lu";

import { cn } from "@/utils/cn";

type SelectContext = {
  portal: boolean;
};

const SelectContext = createContext<SelectContext>({
  portal: true,
});

const SelectContextProvider = SelectContext.Provider;

const Select = forwardRef<
  ElementRef<typeof ArkSelect.Root>,
  ComponentPropsWithoutRef<typeof ArkSelect.Root> & {
    portal?: boolean;
  }
>(({ portal, ...props }, ref) => {
  return (
    <SelectContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkSelect.Root
        ref={ref}
        unmountOnExit={false}
        lazyMount={true}
        {...props}
      />
    </SelectContextProvider>
  );
});

Select.displayName = "Select";

const selectTriggerVariants = cva(
  "tw-flex tw-w-full tw-items-center tw-justify-between tw-rounded-md tw-px-3 tw-py-2 tw-text-sm placeholder:tw-text-muted-foreground disabled:tw-cursor-not-allowed disabled:tw-opacity-50 [&>span]:!tw-truncate tw-transition-all tw-duration-150 tw-outline-none",
  {
    variants: {
      variant: {
        default:
          "tw-h-10 tw-border tw-border-input tw-bg-background focus:tw-outline-none",
        ghost:
          "tw-text-muted-foreground hover:tw-text-accent-foreground hover:tw-bg-accent text-center",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const SelectTrigger = forwardRef<
  ElementRef<typeof ArkSelect.Trigger>,
  ArkSelect.TriggerProps & VariantProps<typeof selectTriggerVariants>
>(({ variant, className, children, ...props }, ref) => {
  return (
    <ArkSelect.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant === "default" && (
        <ChevronDown className="tw-mr-2 tw-size-4 tw-text-muted-foreground" />
      )}
    </ArkSelect.Trigger>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectValue = forwardRef<
  ElementRef<typeof ArkSelect.ValueText>,
  ArkSelect.ValueTextProps
>(({ className, ...props }, ref) => {
  return (
    <ArkSelect.ValueText
      ref={ref}
      className={cn("tw-truncate", className)}
      {...props}
    />
  );
});

SelectValue.displayName = "SelectValue";

const SelectContent = forwardRef<
  ElementRef<typeof ArkSelect.Content>,
  ArkSelect.ContentProps
>(({ className, ...props }, ref) => {
  const { portal } = useContext(SelectContext);

  if (typeof portal === "undefined") {
    throw new Error("SelectContent must be a child of Select");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkSelect.Positioner>
        <ArkSelect.Content
          ref={ref}
          className={cn(
            "custom-scrollbar tw-z-50 tw-overflow-auto tw-rounded-md tw-border tw-bg-popover tw-p-1 tw-text-popover-foreground tw-shadow-md focus-visible:tw-outline-none",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
            "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ArkSelect.Positioner>
    </Comp>
  );
});

SelectContent.displayName = "SelectContent";

const SelectGroup = ArkSelect.ItemGroup;

const SelectLabel = forwardRef<
  ElementRef<typeof ArkSelect.Label>,
  ArkSelect.LabelProps
>(({ className, ...props }, ref) => {
  return (
    <ArkSelect.Label
      ref={ref}
      className={cn(
        "tw-py-1.5 tw-pl-2 tw-pr-2 tw-text-xs tw-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

SelectLabel.displayName = "SelectLabel";

const SelectItem = forwardRef<
  ElementRef<typeof ArkSelect.Item>,
  ArkSelect.ItemProps & {
    item: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <ArkSelect.Item
      ref={ref}
      className={cn(
        "tw-relative tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none",
        "data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50",
        "data-[highlighted]:tw-bg-accent data-[highlighted]:tw-text-accent-foreground",
        "data-[state=checked]:tw-text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
});

SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
};
