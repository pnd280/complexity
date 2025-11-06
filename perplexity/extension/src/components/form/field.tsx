"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/wrappers/cn";

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "x:flex x:flex-col x:gap-6",
        "x:has-[>[data-slot=checkbox-group]]:gap-3 x:has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "x:mb-3 x:font-medium",
        "x:data-[variant=legend]:text-base",
        "x:data-[variant=label]:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "x:group/field-group [&>[data-slot=field-group]]:gap-4 x:@container/field-group x:flex x:w-full x:flex-col x:gap-7 x:data-[slot=checkbox-group]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "x:group/field x:flex x:w-full x:gap-3 x:data-[invalid=true]:text-caution",
  {
    variants: {
      orientation: {
        vertical: ["[&>*]:w-full [&>.sr-only]:w-auto x:flex-col"],
        horizontal: [
          "x:flex-row x:items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "x:has-[>[data-slot=field-content]]:items-start x:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "[&>*]:w-full [&>.sr-only]:w-auto x:flex-col x:@md/field-group:flex-row x:@md/field-group:items-center x:@md/field-group:*:w-auto",
          "x:@md/field-group:*:data-[slot=field-label]:flex-auto",
          "x:@md/field-group:x:has-[>[data-slot=field-content]]:items-start x:@md/field-group:x:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "x:group/field-content x:flex x:flex-1 x:flex-col x:gap-1.5 x:leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "x:group/field-label x:peer/field-label x:flex x:w-fit x:gap-2 x:leading-snug x:group-data-[disabled=true]/field:opacity-50",
        "[&>*]:data-[slot=field]:p-4 x:has-[>[data-slot=field]]:w-full x:has-[>[data-slot=field]]:flex-col x:has-[>[data-slot=field]]:rounded-md x:has-[>[data-slot=field]]:border",
        "x:has-data-[state=checked]:border-primary x:has-data-[state=checked]:bg-primary/5 x:dark:has-data-[state=checked]:bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "x:flex x:w-fit x:items-center x:gap-2 x:text-sm x:leading-snug x:font-medium x:group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "x:text-sm x:leading-normal x:font-normal x:text-muted-foreground x:group-has-data-[orientation=horizontal]/field:text-balance",
        "[[data-variant=legend]+&]:-mt-1.5 x:last:mt-0 x:nth-last-2:-mt-1",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={children !== undefined && children !== null}
      className={cn(
        "x:relative x:-my-2 x:h-5 x:text-sm x:group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator className="x:absolute x:inset-0 x:top-1/2" />
      {children !== undefined && children !== null && (
        <span
          className="x:relative x:mx-auto x:block x:w-fit x:bg-background x:px-2 x:text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children !== undefined && children !== null) {
      return children;
    }

    if (errors === undefined || errors.length === 0) {
      return null;
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="x:ml-4 x:flex x:list-disc x:flex-col x:gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>,
        )}
      </ul>
    );
  }, [children, errors]);

  if (content === undefined || content === null) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("x:text-sm x:font-normal x:text-caution", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
