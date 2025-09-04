import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getThemeCss } from "@/plugins/_core/custom-theme/utils";
import { InstantCssService } from "@/services/instant-css";
import { insertCss } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "customTheme:inlineLoader": void;
  }
}
export default function loader() {
  asyncLoaderRegistry.register({
    id: "customTheme:inlineLoader",
    dependencies: ["cache:extensionSettings"],
    loader: async ({ "cache:extensionSettings": extensionSettings }) => {
      if (await InstantCssService.hasPermissions()) return;

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
