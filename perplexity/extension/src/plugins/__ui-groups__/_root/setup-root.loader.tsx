import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { lazily } from "react-lazily";
import { RouterProvider } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { createRouter } from "@/plugins/__core__/hash-router/router";
import CsUiRoot from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { PersistentQueryCacheInvalidator } = lazily(
  () => import("@/plugins/__ui-groups__/_root/PersistentQueryCacheInvalidator"),
);

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "csui:root": void;
  }
}

export default function csUiRootLoader() {
  AsyncLoaderRegistry.register({
    id: "csui:root",
    dependencies: [
      "lib:i18n",
      "lib:dayjs",
      "cache:pluginsEnableStates",
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
      const hashRouter = createRouter();

      root.render(
        <QueryClientProvider client={persistentQueryClient.queryClient}>
          <CsUiRoot />
          <RouterProvider router={hashRouter} />
          {APP_CONFIG.CPLX_CDN_URL != null && (
            <Suspense>
              <PersistentQueryCacheInvalidator />
            </Suspense>
          )}
        </QueryClientProvider>,
      );
    },
  });
}
