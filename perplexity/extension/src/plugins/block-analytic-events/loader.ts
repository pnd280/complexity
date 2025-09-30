import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { NetworkInterceptMiddlewareManagerService } from "@/plugins/__core__/_main-world/network-intercept/_service/service-init.loader";
import { parseWebSocketData } from "@/plugins/__core__/_main-world/network-intercept/web-socket-message-parser";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:blockAnalyticEvents": void;
  }
}

export default function loader() {
  AsyncLoaderRegistry.register({
    id: "plugin:blockAnalyticEvents",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["blockAnalyticEvents"]) return;

      NetworkInterceptMiddlewareManagerService.Root.addMiddleware({
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
