import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export default function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "tw-shrink-0 tw-bg-border",
        orientation === "horizontal"
          ? "tw-h-[1px] tw-w-full"
          : "tw-h-full tw-w-[1px]",
        className,
      )}
      {...props}
    />
  );
}
