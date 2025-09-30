import { cva } from "class-variance-authority";

import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { PLUGIN_TAGS } from "@/data/dashboard/plugin-tags";
import type { PluginTagValues } from "@/data/dashboard/plugin-tags";

type PluginTagProps = {
  tag: PluginTagValues;
};

const variantOptions = {
  experimental:
    "x:bg-destructive x:text-destructive-foreground x:hover:bg-destructive/80",
  new: "x:bg-primary x:text-primary-foreground x:hover:bg-primary/80",
  deprecated:
    "x:bg-orange-500 x:text-orange-500-foreground x:hover:bg-orange-500/80",
} as const satisfies Partial<Record<PluginTagValues, string>>;

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
  tag: PluginTagValues,
): tag is Extract<PluginTagValues, VariantType> => {
  return tag in variantOptions;
};

export function PluginTag({ tag }: PluginTagProps) {
  return (
    <Tooltip content={PLUGIN_TAGS[tag].description}>
      <Badge
        variant="secondary"
        className={tagVariants({
          variant: isColoredVariant(tag) ? tag : "default",
        })}
      >
        {PLUGIN_TAGS[tag].label.toLocaleUpperCase()}
      </Badge>
    </Tooltip>
  );
}
