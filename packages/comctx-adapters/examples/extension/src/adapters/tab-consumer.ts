import type { Adapter, Message, OnMessage, SendMessage } from "comctx";

type MessageMeta = {
  tab?: {
    tabId?: number;
    frameId?: number;
  };
};

export class TabConsumerAdapter implements Adapter<MessageMeta> {
  private tabId: number;
  private frameId: number;

  constructor({ tabId, frameId }: { tabId: number; frameId?: number }) {
    this.tabId = tabId;
    this.frameId = frameId ?? 0;
  }

  sendMessage: SendMessage<MessageMeta> = (message) => {
    const tab = chrome.tabs.get(this.tabId);

    if (tab == null) return;

    chrome.tabs.sendMessage(this.tabId, message, {
      frameId: this.frameId,
    });
  };

  onMessage: OnMessage<MessageMeta> = (callback) => {
    const handler = (message: Message<MessageMeta>): undefined => {
      callback(message);
    };

    chrome.runtime.onMessage.addListener(handler);

    return () => chrome.runtime.onMessage.removeListener(handler);
  };
}
