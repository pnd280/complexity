import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { lazily } from "react-lazily";
import { RouterProvider } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import { queryClient } from "@/data/query-client";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import CsUiRoot from "@/plugins/_core/ui/_root/CsUiRoot";
import { createRouter } from "@/plugins/_core/ui/_root/router";

const { RemoteResourcesInvalidator } = lazily(
  () => import("@/plugins/_core/ui/_root/RemoteResourcesInvalidator"),
);

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "csui:root": void;
  }
}

export default function csUiRootLoader() {
  asyncLoaderRegistry.register({
    id: "csui:root",
    dependencies: [
      "lib:i18n",
      "lib:dayjs",
      "cache:pluginsStates",
      "cache:languageModels",
      "cache:domSelectors",
    ],
    loader: () => {
      const $existingPortals = $("body > [data-type=portal]");

      const $root = $("<div>").attr("id", "complexity-root");

      if ($existingPortals[0]) {
        $root.insertBefore($existingPortals[0]);
      } else {
        $root.appendTo(document.body);
      }

      if ($root[0] == null) return;

      const root = createRoot($root[0]);
      const router = createRouter();

      root.render(
        <>
          <QueryClientProvider client={queryClient}>
            <CsUiRoot />
            <RouterProvider router={router} />
          </QueryClientProvider>
          {APP_CONFIG.CPLX_CDN_URL != null && (
            <Suspense>
              <RemoteResourcesInvalidator />
            </Suspense>
          )}
        </>,
      );
    },
  });
}
