import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { InstantCssService } from "@/services/features/instant-css";
import { getInstantCssInjectorService } from "@/services/features/instant-css/injector/service-init.bg-worker";
import { sendMessage } from "@/types/chrome-runtime-message";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "misc:manualInstantCss": void;
  }
}

export default async function () {
  asyncLoaderRegistry.register({
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

      await getInstantCssInjectorService().injectCssToTab(tabId);
    },
  });
}
