import type { Adapter, Message, SendMessage, OnMessage } from "comctx";

type MessageMeta = {
  sender: {
    tabId: NonNullable<chrome.runtime.MessageSender["tab"]>["id"];
    frameId: chrome.runtime.MessageSender["frameId"];
  } | null;
};

export class BrowserRuntimeAdapter implements Adapter<MessageMeta> {
  sendMessage: SendMessage<MessageMeta> = async (message) => {
    if (message.meta.sender != null && message.meta.sender.tabId != null) {
      void chrome.tabs.sendMessage(message.meta.sender.tabId, message);
    } else {
      void chrome.runtime.sendMessage(message);
    }
  };

  onMessage: OnMessage<MessageMeta> = (callback) => {
    const handler = (
      message: Message<MessageMeta>,
      sender: chrome.runtime.MessageSender,
    ): undefined => {
      callback({
        ...message,
        meta: {
          sender: {
            tabId: sender.tab?.id,
            frameId: sender.frameId,
          },
        },
      });
    };

    chrome.runtime.onMessage.addListener(handler);

    return () => chrome.runtime.onMessage.removeListener(handler);
  };
}
