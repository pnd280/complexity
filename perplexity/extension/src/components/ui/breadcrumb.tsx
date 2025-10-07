import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { type ReactNode } from "react";

import TablerChevronRight from "~icons/tabler/chevron-right";
import TablerDots from "~icons/tabler/dots";

type BreadcrumbProps = ComponentProps<"nav"> & {
  separator?: ReactNode;
  collapsed?: boolean;
};

export function Breadcrumb({
  collapsed = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      data-collapsed={collapsed}
      className={cn("x:w-full x:overflow-hidden", className)}
      {...props}
    />
  );
}

export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "x:flex x:items-center x:gap-1.5 x:text-sm x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-item=""
      className={cn("x:flex x:shrink-0 x:items-center", className)}
      {...props}
    />
  );
}

export function BreadcrumbLink({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn("x:transition-colors x:hover:text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("x:font-normal x:text-foreground", className)}
      {...props}
    />
  );
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      data-separator=""
      className={cn("x:[&>svg]:h-3.5 x:[&>svg]:w-3.5", className)}
      {...props}
    >
      {children ?? <TablerChevronRight />}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(
        "x:flex x:h-9 x:w-9 x:items-center x:justify-center",
        className,
      )}
      {...props}
    >
      <TablerDots className="x:h-4 x:w-4" />
      <span className="x:sr-only">More</span>
    </span>
  );
}
