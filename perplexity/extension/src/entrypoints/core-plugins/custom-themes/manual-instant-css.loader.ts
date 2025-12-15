import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { InstantCssService } from "@/entrypoints/services/features/instant-css";
import { InstantCssInjectorService } from "@/entrypoints/services/features/instant-css/injector/service-init.bg-worker";
import { sendMessage } from "@/types/chrome-runtime-message";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "misc:manualInstantCss": void;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "misc:manualInstantCss",
    dependencies: ["store:pluginGuards"],
    loader: async ({ "store:pluginGuards": pluginGuardsStore }) => {
      if (
        !InstantCssService.hasPermissionsSync({
          grantedPermissions: pluginGuardsStore.grantedPermissions,
        })
      )
        return;

      const isInjected = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--cplx-instant-css-injected");

      if (isInjected) return;

      InstantCssService.logger.info("Not injected, manual injection requested");

      const tabId = await sendMessage("getTabId");

      await InstantCssInjectorService.Instance.injectCssToTab(tabId);
    },
  });
}
