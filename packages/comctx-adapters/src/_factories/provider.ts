import type { Adapter, SendMessage, OnMessage } from "comctx";
import type { Endpoint } from "webext-bridge";

import { buildDestination } from "@/utils";
import type { MessageFunctions } from "@/webext-bridge-overrides";

type MessageMeta = {
  webextBridgeSender: Endpoint;
};

export function createProvider({
  webextBridgeMessageChannelId,
  bridge,
}: {
  webextBridgeMessageChannelId: string;
  bridge: {
    onMessage: MessageFunctions["onMessage"];
    sendMessage: MessageFunctions["sendMessage"];
  };
}): new () => Adapter<MessageMeta> {
  return class BackgroundProvider implements Adapter<MessageMeta> {
    sendMessage: SendMessage<MessageMeta> = async (message) =>
      bridge.sendMessage(
        webextBridgeMessageChannelId as any,
        message,
        buildDestination({
          context: message.meta.webextBridgeSender.context,
          tabId: message.meta.webextBridgeSender.tabId,
          frameId: message.meta.webextBridgeSender.frameId,
        }) as any,
      );

    onMessage: OnMessage<MessageMeta> = (callback) =>
      bridge.onMessage(webextBridgeMessageChannelId as any, (data) => {
        callback({
          ...data.data,
          meta: {
            webextBridgeSender: {
              context: data.sender.context,
              tabId: data.sender.tabId,
              frameId: data.sender.frameId,
            },
          },
        });
      });
  };
}
