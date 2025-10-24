import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
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
        </QueryClientProvider>,
      );
    },
  });
}
