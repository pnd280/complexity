import { addMessageListener } from "@/types/chrome-runtime-message";

declare module "@/types/chrome-runtime-message" {
  interface EventHandlers {
    getTabId: () => number;
    someThing: ({ someParam }: { someParam: string }) => void;
  }
}

export default function () {
  addMessageListener({
    getTabId: (message, sender) => {
      invariant(sender.tab, "Sender is not a tab");
      return sender.tab.id!;
    },
    someThing: (message, _sender) => {
      const { someParam } = message.data;
      console.log("Received someParam:", someParam);
      return undefined;
    },
  });
}
