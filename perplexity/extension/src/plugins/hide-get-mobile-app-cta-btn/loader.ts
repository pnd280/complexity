import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { hideGetMobileAppCtaBtnCssResourceConfig } from "@/plugins/hide-get-mobile-app-cta-btn/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { insertCss } from "@/utils/dom-utils/generics";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:hideGetMobileAppCtaBtn": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:hideGetMobileAppCtaBtn",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["hide-get-mobile-app-cta-btn"]) return;

      insertCss({
        css: await getVersionedRemoteResource(
          hideGetMobileAppCtaBtnCssResourceConfig,
        ),
        id: "hide-get-mobile-app-cta-btn",
      });
    },
  });
}
