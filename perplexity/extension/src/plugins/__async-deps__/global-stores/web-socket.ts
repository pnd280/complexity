import type { Socket } from "socket.io-client";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type InternalWebSocketStore = {
  common: Socket | null;
};

export const internalWebSocketStore =
  createWithEqualityFn<InternalWebSocketStore>()(
    subscribeWithSelector(
      immer(
        (set, get): InternalWebSocketStore => ({
          common: null,
        }),
      ),
    ),
  );
