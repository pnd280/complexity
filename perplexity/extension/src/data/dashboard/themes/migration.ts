import type { Theme } from "@/data/dashboard/themes/theme.types";
import {
  generateThemeData,
  initialValues,
} from "@/data/dashboard/themes/utils";

export function legacyThemeMigration(theme: Theme) {
  if (theme.config == null) return;

  console.log("Migrating theme", theme.id);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (theme.config.accentColorSelection == null) {
    theme.config.accentColorSelection = "default";
  }

  if (
    theme.config.accentColor?.length != null &&
    theme.config.accentColor.length > 0
  ) {
    theme.config.accentColorSelection = "custom";

    const newData = generateThemeData(theme.config, initialValues);

    theme.css = newData.css;
    theme.displayBannerColors = newData.displayBannerColors;
  }
}
