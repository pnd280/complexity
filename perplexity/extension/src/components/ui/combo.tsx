import { Combobox as ArkCombobox } from "@ark-ui/react/combobox";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { createContext, use } from "react";
import {
  LuChevronDown as ChevronDown,
  LuX as ClearIcon,
  LuCheck,
  LuX,
} from "react-icons/lu";

import { Portal } from "@/components/ui/portal";
import { untrapWheel } from "@/utils/dom-utils/generics";

type ComboboxContext = {
  portal: boolean;
};

const ComboboxContext = createContext<ComboboxContext>({
  portal: true,
});

const ComboboxContextProvider = ComboboxContext.Provider;

export function Combobox({
  portal,
  ...props
}: ComponentProps<typeof ArkCombobox.Root> & {
  portal?: boolean;
}) {
  return (
    <ComboboxContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkCombobox.Root unmountOnExit={false} lazyMount={true} {...props} />
    </ComboboxContextProvider>
  );
}

const comboboxTriggerVariants = cva(
  "x:flex x:w-full x:items-center x:justify-between x:rounded-md x:px-2 x:text-sm x:font-medium x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:disabled:cursor-not-allowed x:disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "x:bg-primary-foreground x:hover:text-muted-foreground x:focus:outline-none x:active:scale-95",
        ghost:
          "text-center x:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground x:active:scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function ComboboxTrigger({
  variant,
  className,
  children,
  ...props
}: ArkCombobox.TriggerProps & {
  variant: VariantProps<typeof comboboxTriggerVariants>["variant"];
}) {
  return (
    <ArkCombobox.Trigger
      className={cn(comboboxTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}
      <ChevronDown className="x:ml-2 x:size-4 x:text-muted-foreground" />
    </ArkCombobox.Trigger>
  );
}

export function ComboboxInput({ className, ...props }: ArkCombobox.InputProps) {
  return (
    <div className="x:relative x:w-full">
      <ArkCombobox.Control>
        <ArkCombobox.Input
          className={cn(
            "x:flex x:h-9 x:w-full x:rounded-md x:border x:border-input x:bg-transparent x:px-3 x:py-1 x:text-sm x:shadow-sm x:transition-colors",
            "x:placeholder:text-muted-foreground",
            "x:focus:ring-1 x:focus:ring-ring x:focus:outline-none",
            "x:disabled:cursor-not-allowed x:disabled:opacity-50",
            className,
          )}
          {...props}
        />
      </ArkCombobox.Control>
    </div>
  );
}

export function ComboboxInputMultipleValues({
  className,
  placeholder,
  ...props
}: ArkCombobox.InputProps) {
  return (
    <div className="x:relative x:w-full">
      <ArkCombobox.Control>
        <div className="x:flex x:h-auto x:min-h-[36px] x:w-full x:flex-wrap x:gap-1.5 x:rounded-md x:border x:border-input x:bg-transparent x:px-3 x:py-1.5 x:text-sm x:shadow-sm x:transition-colors x:focus-within:ring-1 x:focus-within:ring-ring">
          <ArkCombobox.Label asChild>
            <div className="x:flex x:flex-wrap x:gap-1.5">
              <ArkCombobox.Context>
                {({ value, setValue }) =>
                  value.map((item) => (
                    <span
                      key={item}
                      className="x:flex x:items-center x:gap-1 x:rounded-md x:bg-secondary x:px-2 x:py-0.5 x:text-sm"
                    >
                      {item}
                      <button
                        className="x:ml-1 x:rounded-sm x:text-muted-foreground x:hover:text-foreground x:focus:ring-2 x:focus:ring-ring x:focus:outline-none"
                        onClick={(e) => {
                          e.preventDefault();
                          setValue(value.filter((v) => v !== item));
                        }}
                      >
                        <LuX className="x:size-3" />
                      </button>
                    </span>
                  ))
                }
              </ArkCombobox.Context>
            </div>
          </ArkCombobox.Label>
          <ArkCombobox.Input
            placeholder={placeholder}
            className={cn(
              "x:flex-1 x:bg-transparent x:outline-none x:placeholder:text-muted-foreground x:disabled:cursor-not-allowed x:disabled:opacity-50",
              className,
            )}
            {...props}
          />
        </div>
      </ArkCombobox.Control>
    </div>
  );
}

export function ComboboxClearTrigger({
  className,
  children,
  ...props
}: ArkCombobox.ClearTriggerProps) {
  return (
    <ArkCombobox.ClearTrigger
      className={cn(
        "x:absolute x:top-2 x:right-2 x:rounded-sm x:opacity-70 x:ring-offset-background x:transition-opacity",
        "x:hover:opacity-100",
        "x:focus:ring-2 x:focus:ring-ring x:focus:ring-offset-2 x:focus:outline-none",
        "x:disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      {children ?? <ClearIcon className="x:size-4" />}
    </ArkCombobox.ClearTrigger>
  );
}

export function ComboboxContent({
  className,
  ...props
}: ArkCombobox.ContentProps) {
  const { portal } = use(ComboboxContext);

  if (typeof portal === "undefined") {
    throw new Error("ComboboxContent must be a child of Combobox");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkCombobox.Positioner>
        <ArkCombobox.Content
          className={cn(
            "custom-scrollbar x:z-50 x:max-h-[300px] x:min-w-[8rem] x:overflow-auto x:rounded-md x:border x:border-border/50 x:bg-popover x:p-1 x:text-popover-foreground x:shadow-md",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkCombobox.Positioner>
    </Comp>
  );
}

export function ComboboxItem({
  className,
  children,
  ...props
}: ArkCombobox.ItemProps) {
  return (
    <ArkCombobox.Item
      className={cn(
        "x:relative x:flex x:w-full x:cursor-pointer x:items-center x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:outline-none x:select-none",
        "x:data-[disabled]:pointer-events-none x:data-[disabled]:opacity-50",
        "x:data-[highlighted]:bg-primary-foreground x:data-[highlighted]:text-primary",
        className,
      )}
      {...props}
    >
      <span className="x:absolute x:left-2 x:flex x:size-3.5 x:items-center x:justify-center">
        <ArkCombobox.ItemIndicator>
          <LuCheck className="x:size-3.5" />
        </ArkCombobox.ItemIndicator>
      </span>
      <ArkCombobox.ItemText className="x:ml-6">{children}</ArkCombobox.ItemText>
    </ArkCombobox.Item>
  );
}

export const ComboboxGroup = ArkCombobox.ItemGroup;

export function ComboboxLabel({ className, ...props }: ArkCombobox.LabelProps) {
  return (
    <ArkCombobox.Label
      className={cn(
        "x:mb-2 x:block x:text-xs x:font-medium x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxItemGroupLabel({
  className,
  ...props
}: ArkCombobox.ItemGroupLabelProps) {
  return (
    <ArkCombobox.ItemGroupLabel
      className={cn(
        "x:py-1.5 x:pr-2 x:pl-2 x:text-xs x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
