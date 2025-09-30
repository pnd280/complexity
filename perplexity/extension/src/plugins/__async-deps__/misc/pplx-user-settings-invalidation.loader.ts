import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "networkIntercept:pplxApi": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "networkIntercept:pplxApi",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      const shouldInvalidatePplxUserSettings =
        pluginsEnableStates["queryBox:languageModelSelector"] ||
        pluginsEnableStates["imageGenModelSelector"];

      if (shouldInvalidatePplxUserSettings) {
        NetworkInterceptMiddlewareManagerService.Root.addMiddleware({
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
