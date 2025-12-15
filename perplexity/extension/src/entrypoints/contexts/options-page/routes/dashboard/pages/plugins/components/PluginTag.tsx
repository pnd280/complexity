import { cva } from "class-variance-authority";

import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import PluginDashboardMetaConsts from "@/entrypoints/services/plugins/dashboard-meta";
import type { PluginTagKeys } from "@/entrypoints/services/plugins/dashboard-meta/types";

type PluginTagProps = {
  tag: PluginTagKeys;
};

const variantOptions = {
  experimental: "x:bg-caution x:text-caution-foreground x:hover:bg-caution/80",
  new: "x:bg-primary x:text-primary-foreground x:hover:bg-primary/80",
  deprecated:
    "x:bg-orange-500 x:text-orange-500-foreground x:hover:bg-orange-500/80",
  updated: "x:bg-success/70 x:text-primary-foreground x:hover:bg-success/50",
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
  if (PluginDashboardMetaConsts.tags[tag] == null) return null;

  return (
    <Tooltip content={PluginDashboardMetaConsts.tags[tag].description}>
      <Badge
        variant="secondary"
        className={tagVariants({
          variant: isColoredVariant(tag) ? tag : "default",
        })}
      >
        {PluginDashboardMetaConsts.tags[tag].label.toLocaleUpperCase()}
      </Badge>
    </Tooltip>
  );
}
