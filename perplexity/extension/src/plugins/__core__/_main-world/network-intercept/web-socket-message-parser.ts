import * as parser from "engine.io-parser";

import { jsonUtils } from "@/utils/misc/utils";

export type WebSocketMessage<T = unknown> = {
  messageId?: number;
  payload: T;
};

export type WebSocketPacket = {
  type: parser.PacketType;
  data: string;
};

export function parseWebSocketData<T = unknown>(
  data: string,
): WebSocketMessage<T> {
  try {
    const parsedPacket = parser.decodePacket(data);

    if (parsedPacket.data == null) {
      return { payload: data as T };
    }

    const match = parsedPacket.data.match(/^(\d+)/);
    const messageId = match != null ? parseInt(match[1]) : undefined;

    const payloadStr = parsedPacket.data.replace(/^\d+/, "");
    const payload = jsonUtils.safeParse(payloadStr) ?? payloadStr;

    return messageId != null
      ? { messageId, payload: payload as T }
      : { payload: payload as T };
  } catch {
    return { payload: data as T };
  }
}

export function encodeWebSocketData(packet: WebSocketPacket): string {
  try {
    const encoded = parser.encodePacket(
      {
        type: packet.type,
        data: packet.data,
      },
      false,
      (encodedPacket: string) => encodedPacket,
    );

    if (typeof encoded !== "string") {
      throw new Error("Encoded packet is not a string");
    }

    return encoded;
  } catch (error) {
    console.error("Failed to encode WebSocket packet:", error);
    throw error;
  }
}

export function encodeWebSocketDataWithoutPrefix(
  packet: WebSocketPacket,
): string {
  return encodeWebSocketData(packet).slice(1);
}
