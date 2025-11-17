import { onMessage } from "@/types/chrome-runtime-message";

declare module "@/types/chrome-runtime-message" {
  interface EventHandlers {
    getTabId: () => number;
  }
}

export default function () {
  onMessage({
    getTabId: (message, sender) => {
      invariant(sender.tab, "[ContentScriptUtils] Invalid context");
      return sender.tab.id!;
    },
  });
}
