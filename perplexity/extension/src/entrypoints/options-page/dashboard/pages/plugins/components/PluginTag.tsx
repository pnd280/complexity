import { cva } from "class-variance-authority";

import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import PluginMeta from "@/data/dashboard/plugin-meta";
import type { PluginTagKeys } from "@/data/dashboard/plugin-meta/types";

type PluginTagProps = {
  tag: PluginTagKeys;
};

const variantOptions = {
  experimental:
    "x:bg-destructive x:text-destructive-foreground x:hover:bg-destructive/80",
  new: "x:bg-primary x:text-primary-foreground x:hover:bg-primary/80",
  deprecated:
    "x:bg-orange-500 x:text-orange-500-foreground x:hover:bg-orange-500/80",
} as const satisfies Partial<Record<PluginTagKeys, string>>;

type VariantType = keyof typeof variantOptions;

const tagVariants = cva("x:border x:border-border/50 x:hover:bg-background", {
  variants: {
    variant: { default: "", ...variantOptions },
  },
  defaultVariants: {
    variant: "default",
  },
});

const isColoredVariant = (
  tag: PluginTagKeys,
): tag is Extract<PluginTagKeys, VariantType> => {
  return tag in variantOptions;
};

export function PluginTag({ tag }: PluginTagProps) {
  if (PluginMeta.tags[tag] == null) return null;

  return (
    <Tooltip content={PluginMeta.tags[tag].description}>
      <Badge
        variant="secondary"
        className={tagVariants({
          variant: isColoredVariant(tag) ? tag : "default",
        })}
      >
        {PluginMeta.tags[tag].label.toLocaleUpperCase()}
      </Badge>
    </Tooltip>
  );
}
