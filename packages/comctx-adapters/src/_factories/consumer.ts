import type { Adapter, SendMessage, OnMessage } from "comctx";

import { buildDestination } from "@/utils";
import type { MessageFunctions } from "@/webext-bridge-overrides";

export function createConsumer({
  webextBridgeMessageChannelId,
  destination,
  bridge,
}: {
  webextBridgeMessageChannelId: string;
  destination: string;
  bridge: {
    onMessage: MessageFunctions["onMessage"];
    sendMessage: MessageFunctions["sendMessage"];
  };
}): new () => Adapter {
  return class SimpleConsumer implements Adapter {
    sendMessage: SendMessage = async (message) =>
      bridge.sendMessage(
        webextBridgeMessageChannelId as any,
        message,
        destination as any,
      );

    onMessage: OnMessage = (callback) =>
      bridge.onMessage(webextBridgeMessageChannelId as any, (data) => {
        callback({ ...data.data });
      });
  };
}

export function createTabConsumer({
  webextBridgeMessageChannelId,
  destinationContext,
  bridge,
}: {
  webextBridgeMessageChannelId: string;
  destinationContext: string;
  bridge: {
    onMessage: MessageFunctions["onMessage"];
    sendMessage: MessageFunctions["sendMessage"];
  };
}): new (options?: { tabId?: number; frameId?: number }) => Adapter {
  return class TargetedConsumer implements Adapter {
    private tabId: number | undefined = undefined;
    private frameId: number | undefined = undefined;

    constructor(options: { tabId?: number; frameId?: number } = {}) {
      this.tabId = options.tabId;
      this.frameId = options.frameId;
    }

    sendMessage: SendMessage = async (message) =>
      bridge.sendMessage(
        webextBridgeMessageChannelId as any,
        message,
        buildDestination({
          context: destinationContext,
          tabId: this.tabId,
          frameId: this.frameId,
        }) as any,
      );

    onMessage: OnMessage = (callback) =>
      bridge.onMessage(webextBridgeMessageChannelId as any, (data) => {
        callback({ ...data.data });
      });
  };
}
