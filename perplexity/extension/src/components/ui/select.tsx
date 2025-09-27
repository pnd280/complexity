import { Select as ArkSelect } from "@ark-ui/react/select";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { createContext, use } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuChevronDown as ChevronDown } from "react-icons/lu";

import { Portal } from "@/components/ui/portal";
import { untrapWheel } from "@/utils/dom-utils/generics";

type SelectLocalContext = {
  portal: boolean;
};

const SelectLocalContext = createContext<SelectLocalContext>({
  portal: true,
});

const SelectLocalContextProvider = SelectLocalContext.Provider;

export const SelectContext = ArkSelect.Context;

export function Select<T>({
  portal,
  ...props
}: ComponentProps<typeof ArkSelect.Root<T>> & {
  portal?: boolean;
}) {
  return (
    <SelectLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkSelect.Root<T> unmountOnExit={false} lazyMount={true} {...props} />
    </SelectLocalContextProvider>
  );
}

const selectTriggerVariants = cva(
  "x:flex x:w-full x:items-center x:justify-between x:rounded-lg x:px-2 x:text-sm x:font-medium x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:focus-visible:bg-primary-foreground x:disabled:cursor-not-allowed x:disabled:opacity-50 x:[&>span]:!truncate",
  {
    variants: {
      variant: {
        default:
          "x:bg-primary-foreground x:hover:text-muted-foreground x:focus:outline-none x:active:scale-95",
        ghost:
          "x:text-center x:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground x:active:scale-95",
        noStyle: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type SelectTriggerProps = ArkSelect.TriggerProps &
  VariantProps<typeof selectTriggerVariants>;

export function SelectTrigger({
  variant = "default",
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <ArkSelect.Trigger
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      {variant === "default" && (
        <ChevronDown className="x:ml-2 x:size-4 x:text-muted-foreground" />
      )}
    </ArkSelect.Trigger>
  );
}

export type SelectValueProps = ArkSelect.ValueTextProps;

export function SelectValue({ className, ...props }: SelectValueProps) {
  return (
    <ArkSelect.ValueText className={cn("x:truncate", className)} {...props} />
  );
}

export type SelectContentProps = ComponentProps<typeof ArkSelect.Content>;

export function SelectContent({ className, ...props }: SelectContentProps) {
  const { portal } = use(SelectLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("SelectContent must be a child of Select");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkSelect.Positioner>
        <ArkSelect.Content
          className={cn(
            "custom-scrollbar x:z-50 x:overflow-auto x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-2 x:text-popover-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[placement^=bottom]:origin-top x:data-[placement^=left]:origin-right",
            "x:data-[placement^=right]:origin-left x:data-[placement^=top]:origin-bottom",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkSelect.Positioner>
    </Comp>
  );
}

export const SelectGroup = ArkSelect.ItemGroup;

export type SelectLabelProps = ArkSelect.LabelProps;

export function SelectLabel({ className, ...props }: SelectLabelProps) {
  return (
    <ArkSelect.Label
      className={cn(
        "x:py-1.5 x:pr-2 x:pl-2 x:text-xs x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export type SelectItemProps = ArkSelect.ItemProps & {
  checkboxOnSingleItem?: boolean;
  checkIconClassName?: string;
  item: string;
};

export function SelectItem({
  className,
  checkIconClassName,
  children,
  checkboxOnSingleItem = false,
  ...props
}: SelectItemProps) {
  return (
    <ArkSelect.Context>
      {({ multiple, value }) => (
        <ArkSelect.Item
          className={cn(
            "x:relative x:flex x:cursor-pointer x:items-center x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:outline-none x:select-none",
            "x:data-disabled:cursor-not-allowed x:data-disabled:opacity-50",
            "x:transition-all x:data-[highlighted]:bg-secondary",
            "x:justify-between x:text-muted-foreground x:data-[state=checked]:text-primary",
            {
              "x:bg-secondary": value.includes(props.item),
            },
            className,
          )}
          {...props}
        >
          <div
            className={cn("x:w-full", {
              "x:flex x:items-center x:justify-between x:gap-4":
                checkboxOnSingleItem || multiple,
            })}
          >
            <div className="x:flex x:items-center x:gap-2">{children}</div>
            {(multiple || checkboxOnSingleItem) &&
              value.includes(props.item) && (
                <FaCheck
                  className={cn("x:size-3.5 x:shrink-0", checkIconClassName)}
                />
              )}
          </div>
        </ArkSelect.Item>
      )}
    </ArkSelect.Context>
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("x:-mx-1 x:my-1 x:h-px x:bg-muted", className)}
      {...props}
    />
  );
}
