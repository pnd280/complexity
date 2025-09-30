import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { getThemeCss } from "@/plugins/__core__/custom-theme/utils";
import { InstantCssService } from "@/services/features/instant-css";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "customTheme:inlineLoader": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "customTheme:inlineLoader",
    dependencies: ["cache:extensionSettings", "store:pluginGuards"],
    loader: async ({
      "cache:extensionSettings": extensionSettings,
      "store:pluginGuards": pluginGuardsStore,
    }) => {
      if (
        InstantCssService.hasPermissionsSync({
          grantedPermissions: pluginGuardsStore.grantedPermissions,
        })
      )
        return;

      const themeId = extensionSettings.theme;

      if (!themeId) return;

      const themeCss = await getThemeCss(themeId);

      insertCss({
        id: "custom-theme",
        css: themeCss,
      });
    },
  });
}
