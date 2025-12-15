import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { settingsStorage } from "@/entrypoints/core-plugins/custom-themes/settings";
import { getThemeCss } from "@/entrypoints/core-plugins/custom-themes/utils";
import { InstantCssService } from "@/entrypoints/services/features/instant-css";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "customTheme:inlineLoader": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "customTheme:inlineLoader",
    dependencies: ["store:pluginGuards"],
    loader: async ({ "store:pluginGuards": pluginGuardsStore }) => {
      if (
        InstantCssService.hasPermissionsSync({
          grantedPermissions: pluginGuardsStore.grantedPermissions,
        })
      )
        return;

      const { themeId } = await settingsStorage.getValue();

      if (themeId.length === 0) return;

      const themeCss = await getThemeCss(themeId);

      insertCss({
        id: "custom-theme",
        css: themeCss,
      });
    },
  });
}
