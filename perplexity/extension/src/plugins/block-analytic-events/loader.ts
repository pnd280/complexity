import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getNetworkInterceptMiddlewareManagerRootService } from "@/plugins/_core/main-world/network-intercept/_service/service-init.loader";
import { parseWebSocketData } from "@/plugins/_core/main-world/network-intercept/web-socket-message-parser";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:blockAnalyticEvents": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:blockAnalyticEvents",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (pluginsStates?.blockAnalyticEvents === true)
        getNetworkInterceptMiddlewareManagerRootService().addMiddleware({
          id: "block-analytic-events",
          priority: { position: "first" },
          middlewareFn({ data, stopPropagation, skip }) {
            switch (data.type) {
              case "networkIntercept:webSocketEvent": {
                const wsMessage = parseWebSocketData(data.payload.data);
                const payload = wsMessage.payload;

                const hasValidMessageStructure =
                  wsMessage.messageId != null &&
                  Array.isArray(payload) &&
                  payload.length > 0 &&
                  payload[0] != null;

                if (!hasValidMessageStructure) {
                  return skip();
                }

                if (payload[0] === "analytics_event") {
                  stopPropagation("");
                }

                return skip();
              }
              case "networkIntercept:fetchEvent": {
                if (data.payload.url.includes("browser-intake-datadoghq")) {
                  stopPropagation("");
                }
                break;
              }
              case "networkIntercept:beaconEvent": {
                if (
                  data.payload.url ===
                  "https://www.perplexity.ai/rest/event/analytics"
                ) {
                  stopPropagation("");
                }
                break;
              }
            }

            return skip();
          },
        });
    },
  });
}
