import { onMessage } from "@/types/chrome-runtime-message";

declare module "@/types/chrome-runtime-message" {
  interface EventHandlers {
    getTabId: () => number;
  }
}

export default function () {
  onMessage({
    getTabId: (message, sender) => {
      invariant(sender.tab, "Sender is not a tab");
      return sender.tab.id!;
    },
  });
}
