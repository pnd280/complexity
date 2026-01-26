import z from "zod";

import { toast } from "@/components/ui/use-toast";
import { NetworkInterceptMiddlewareManagerService } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/_service/service-init.loader";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import {
  isLabsLanguageModelCode,
  isResearchLanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:thread:messageCompletionNotification": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:thread:messageCompletionNotification",
    dependencies: ["cache:pluginsEnableStates"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["thread:messageCompletionNotification"]) return;

      if (Notification.permission === "default") {
        const permissionReq = await Notification.requestPermission();

        if (permissionReq === "denied") {
          toast({
            title: "Thread Message Completion Notification",
            description: "Please enable notifications for this plugin to work",
          });
          return;
        }
      }

      const schema = z.object({
        status: z.string(),
        query_str: z.string().optional(),
        display_model: z.string(),
      });

      NetworkInterceptMiddlewareManagerService.Root.updateMiddleware({
        id: "message-completion-notification",
        async middlewareFn({ data, skip }) {
          if (document.visibilityState === "visible" && document.hasFocus())
            return skip();

          const isSSEResponse =
            data.type === "networkIntercept:fetchEvent" &&
            data.event === "response";

          if (
            !isSSEResponse ||
            !data.payload.url.includes("/rest/sse/perplexity_ask")
          ) {
            return skip();
          }

          const [parsedData] = tryCatch(() =>
            schema.parse(JSON.parse(data.payload.data)),
          );

          if (parsedData == null) {
            return skip();
          }

          if (
            isResearchLanguageModelCode(parsedData.display_model) ||
            isLabsLanguageModelCode(parsedData.display_model) ||
            parsedData.status !== "COMPLETED"
          ) {
            return skip();
          }

          const queryStr = parsedData.query_str ?? document.title;

          const title =
            queryStr.length > 100 ? queryStr.slice(0, 100) + "..." : queryStr;

          const notification = new Notification(
            t("plugin-thread-message-completion-notification.answerIsReady"),
            {
              body: title,
              icon: "https://www.google.com/s2/favicons?sz=128&domain=perplexity.ai",
            },
          );

          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          return skip();
        },
      });
    },
  });
}
