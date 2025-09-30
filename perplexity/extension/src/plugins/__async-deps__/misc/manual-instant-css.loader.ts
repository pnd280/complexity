import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { InstantCssService } from "@/services/features/instant-css";
import { InstantCssInjectorService } from "@/services/features/instant-css/injector/service-init.bg-worker";
import { sendMessage } from "@/types/chrome-runtime-message";

declare module "@/plugins/__async-deps__/async-loaders" {
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

      console.log("[Instant CSS] Not injected, manual injection requested");

      const tabId = await sendMessage("getTabId");

      await InstantCssInjectorService.Instance.injectCssToTab(tabId);
    },
  });
}
