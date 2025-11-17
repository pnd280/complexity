import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import { generateThemeData } from "@/entrypoints/core-plugins/custom-themes/themes/utils";

export function legacyThemeMigration(theme: Theme) {
  console.log("Migrating theme", theme.id);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (theme.config.accentColorSelection == null) {
    theme.config.accentColorSelection = "default";
  }

  if (theme.config.accentColor.length > 0) {
    theme.config.accentColorSelection = "custom";

    const newData = generateThemeData(theme.config);

    theme.css = newData.css;
    theme.displayBannerColors = newData.displayBannerColors;
  }
}
