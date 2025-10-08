import {
  parseWebSocketData as _parseWebSocketData,
  encodeWebSocketData as _encodeWebSocketData,
} from "@/plugins/__core__/_main-world/network-intercept/web-socket-message-parser";
import { jsonUtils } from "@/utils/misc/utils";

type PplxAskEvent = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  query_str: string;
  webSocketMessageId?: number;
} | null;

export function parsePerplexityAskEvent({
  rawData,
  url,
}: {
  rawData: string;
  url: string;
}): PplxAskEvent {
  const parsedUrl = new URL(url);

  if (parsedUrl.pathname.startsWith("/rest/sse/perplexity_ask")) {
    return parseSSEPayload({ rawData });
  }

  return parseWebSocketData({ rawData });
}

function parseWebSocketData({ rawData }: { rawData: string }): PplxAskEvent {
  const wsMessage = _parseWebSocketData(rawData);
  const payload = wsMessage.payload;

  const hasValidMessageStructure =
    wsMessage.messageId != null &&
    Array.isArray(payload) &&
    payload.length > 0 &&
    payload[0] != null;

  if (!hasValidMessageStructure) return null;

  if (payload.length < 3) return null;

  if (payload[0] !== "perplexity_ask") return null;

  return {
    params: payload[2],
    query_str: payload[1],
    webSocketMessageId: wsMessage.messageId,
  };
}

function parseSSEPayload({ rawData }: { rawData: string }): PplxAskEvent {
  const data = jsonUtils.safeParse(rawData);

  if (data == null) return null;

  if (data.params == null || data.query_str == null) return null;

  return {
    params: data.params,
    query_str: data.query_str,
  };
}

export function encodePerplexityAskEvent({
  url,
  newPayload,
}: {
  url: string;
  newPayload: PplxAskEvent;
}): string {
  const parsedUrl = new URL(url);

  if (
    newPayload?.webSocketMessageId == null ||
    parsedUrl.pathname.startsWith("/rest/sse/perplexity_ask")
  ) {
    return encodeSSEPayload({ newPayload });
  }

  return encodeWebSocketData({ newPayload });
}

function encodeSSEPayload({ newPayload }: { newPayload: unknown }): string {
  return JSON.stringify(newPayload);
}

function encodeWebSocketData({
  newPayload,
}: {
  newPayload: PplxAskEvent;
}): string {
  return _encodeWebSocketData({
    type: "message",
    data: `${newPayload?.webSocketMessageId ?? ""}${JSON.stringify([
      "perplexity_ask",
      newPayload?.query_str,
      newPayload?.params,
    ])}`,
  });
}
