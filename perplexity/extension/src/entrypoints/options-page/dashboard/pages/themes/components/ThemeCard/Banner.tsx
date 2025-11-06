import { Badge } from "@/components/ui/badge";
import {
  cometColors,
  cplxColors,
} from "@/data/dashboard/themes/built-in-colors";
import type { Theme } from "@/data/dashboard/themes/theme.types";

import TablerPaletteFilled from "~icons/tabler/palette-filled";

type ThemeCardBannerProps = {
  theme: Theme;
};

export default function ThemeCardBanner({ theme }: ThemeCardBannerProps) {
  const colors = getBannerColors(theme);

  return (
    <div className="x:size-full x:transition-transform x:duration-500">
      {colors ? <ColorBanner colors={colors} /> : <DefaultBanner />}
    </div>
  );
}

function getBannerColors(theme: Theme): string[] | null {
  const selection = theme.config.accentColorSelection;

  if (selection === "built-in") {
    const color = [...cplxColors, ...cometColors].find(
      (c) => c.value === theme.config.builtInAccentColor,
    );

    if (!color) return null;

    return [color.color.light.super200, color.color.dark.super200];
  }

  if (selection === "custom") {
    return theme.displayBannerColors;
  }

  return null;
}

function ColorBanner({ colors }: { colors: string[] }) {
  return (
    <div className="x:relative x:flex x:size-full">
      {colors.map((color, index) => (
        <div key={index} className="x:relative x:size-full">
          <div
            className="x:size-full"
            style={{ backgroundColor: `oklch(${color})` }}
          />
          <Badge
            className={cn(
              "x:absolute x:top-1/2 x:-translate-y-1/2 x:bg-background/50 x:text-foreground",
              index === 0 ? "x:right-2" : "x:left-2",
            )}
          >
            {index === 0 ? "Light" : "Dark"}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function DefaultBanner() {
  return (
    <div className="x:flex x:size-full x:items-center x:justify-center x:border-b x:border-border/50 x:text-muted-foreground">
      <TablerPaletteFilled className="x:size-10" />
    </div>
  );
}
