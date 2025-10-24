import type { HTMLProps } from "react";

import usePlatformDetection from "@/hooks/usePlatformDetection";

export default function KeyCombo({
  keys,
  keyClassName,
  className,
  ...props
}: HTMLProps<HTMLSpanElement> & {
  keys: string[];
  keyClassName?: string;
}) {
  const isMac = usePlatformDetection() === "mac";

  const processedKeys = keys.map((key) => {
    switch (key.toLowerCase()) {
      case "ctrl":
      case "control":
        return "Ctrl";
      case "meta":
        return "⌘";
      case "alt":
        return isMac ? "⌥" : "Alt";
      case "shift":
        return "⇧";
      case "enter":
        return "⏎";
      default:
        return key;
    }
  });

  if (keys.length === 0) return null;

  return (
    <span className={cn("x:inline-flex x:gap-1", className)} {...props}>
      {processedKeys.map((key, idx) => (
        <span
          key={idx}
          className={cn(
            "x:rounded-sm x:border x:border-border/50 x:px-1 x:font-mono x:font-medium x:text-muted-foreground",
            keyClassName,
          )}
        >
          {key.length === 1 ? key.toUpperCase() : key}
        </span>
      ))}
    </span>
  );
}
