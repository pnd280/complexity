import type { Socket } from "socket.io-client";
import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type InternalWebSocketStore = {
  common: Socket | null;
};

export const internalWebSocketStore =
  createWithEqualityFn<InternalWebSocketStore>()(
    subscribeWithSelector(
      mutative(
        (): InternalWebSocketStore => ({
          common: null,
        }),
      ),
    ),
  );
