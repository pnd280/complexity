import { type HTMLAttributes } from "react";

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "x:shrink-0 x:bg-border",
        orientation === "horizontal" ? "x:h-px x:w-full" : "x:h-full x:w-px",
        className,
      )}
      {...props}
    />
  );
}
