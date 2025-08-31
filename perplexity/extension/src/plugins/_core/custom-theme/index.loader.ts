import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getThemeCss } from "@/plugins/_core/custom-theme/utils";
import { InstantCssService } from "@/services/features/instant-css";
import { insertCss } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "customTheme:inlineLoader": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
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
