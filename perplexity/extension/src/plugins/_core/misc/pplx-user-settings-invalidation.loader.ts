import debounce from "lodash/debounce";

import { queryClient } from "@/data/query-client";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "networkIntercept:pplxApi": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "networkIntercept:pplxApi",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      const shouldInvalidatePplxUserSettings =
        pluginsStates["queryBox:languageModelSelector"] === true ||
        pluginsStates?.imageGenModelSelector === true;

      if (shouldInvalidatePplxUserSettings) {
        networkInterceptMiddlewareManager.addMiddleware({
          id: "invalidate-pplx-user-settings",
          middlewareFn({ data, skip }) {
            const isSSEResponse =
              data.type === "networkIntercept:fetchEvent" &&
              data.event === "response";

            if (!isSSEResponse) {
              return skip();
            }

            const shouldInvalidateSettings =
              data.payload.url ===
                "https://www.perplexity.ai/rest/sse/perplexity_ask" &&
              data.payload.data === "{}";

            if (shouldInvalidateSettings) {
              invalidateSettings();
            }

            return skip();
          },
        });
      }
    },
  });
}

const invalidateSettings = debounce(() => {
  setTimeout(() => {
    queryClient.invalidateQueries({
      queryKey: pplxApiQueries.userSettings.all(),
    });
  }, 3000);
}, 2000);
