import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { createRouter } from "@/plugins/__core__/hash-router/router";
import CsUiRoot from "@/plugins/__ui-groups__/_root/CsUiRoot";

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
      const $root = $("<div>").attr("id", "complexity-root");

      $root.insertAfter($(DomSelectorsService.Root.cachedSync.ROOT));

      if ($root[0] == null) return;

      const hashRouter = createRouter();

      createRoot($root[0]).render(
        <QueryClientProvider client={persistentQueryClient.queryClient}>
          <CsUiRoot />
          <RouterProvider router={hashRouter} />
        </QueryClientProvider>,
      );
    },
  });
}
