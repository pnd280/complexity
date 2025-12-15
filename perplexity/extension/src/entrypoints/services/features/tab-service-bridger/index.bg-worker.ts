import {
  BrowserRuntimeAdapter,
  TabConsumerAdapter,
} from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import { onMessage } from "@/types/chrome-runtime-message";

declare module "@/types/chrome-runtime-message" {
  interface EventHandlers {
    registerBgBridgeService: (params: { namespace: string }) => void;
  }
}

const registeredTabServices = new Set<string>();

export default function () {
  onMessage({
    registerBgBridgeService: (message, sender) => {
      const { namespace } = message.data;

      invariant(sender.tab, "Sender is not a tab");

      if (registeredTabServices.has(`${namespace}:${sender.tab.id!}`)) {
        return;
      }

      const [, getService] = defineProxy(() => ({}), {
        namespace,
        heartbeatCheck: false,
      });

      const service = getService(
        new TabConsumerAdapter({ tabId: sender.tab.id! }),
      );

      const [registerBridgeService] = defineProxy(() => service, {
        namespace: `${namespace}:${sender.tab.id!}`,
        heartbeatCheck: false,
      });

      registerBridgeService(new BrowserRuntimeAdapter());

      registeredTabServices.add(`${namespace}:${sender.tab.id!}`);
    },
  });
}
