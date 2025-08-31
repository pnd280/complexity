import { onMessage } from "webext-bridge/content-script";

import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type {
  BeaconEventData,
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/plugins/_core/main-world/network-intercept/listeners.types";

export type InterceptorsEvents = {
  "networkIntercept:webSocketEvent": (
    event: WebSocketEventData,
  ) => WebSocketEventData["payload"];
  "networkIntercept:xhrEvent": (event: XhrEventData) => XhrEventData["payload"];
  "networkIntercept:fetchEvent": (
    event: FetchEventData,
  ) => FetchEventData["payload"];
  "networkIntercept:beaconEvent": (
    event: BeaconEventData,
  ) => BeaconEventData["payload"];
};

declare module "@/types/webext-bridge-overrides" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface EventHandlers extends InterceptorsEvents {}
}

onlyExtensionGuard();

function setupInterceptorsListeners() {
  onMessage(
    "networkIntercept:webSocketEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cwebSocketEvent", "color: blue", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "networkIntercept:webSocketEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "networkIntercept:xhrEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cxhrEvent", "color: green", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "networkIntercept:xhrEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "networkIntercept:fetchEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cfetchEvent", "color: red", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "networkIntercept:fetchEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "networkIntercept:beaconEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cbeaconEvent", "color: purple", { event, payload });

      if (event === "response") return payload;

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "networkIntercept:beaconEvent", event, payload },
        });

      return newPayload.payload;
    },
  );
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "messaging:networkIntercept": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "messaging:networkIntercept",
    dependencies: [],
    loader: setupInterceptorsListeners,
  });
}
