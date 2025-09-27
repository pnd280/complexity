import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { RouterEvent } from "@/plugins/_core/main-world/spa-router/spa-router.types";
import { isInContentScript } from "@/utils/misc/utils";

export type SpaRouterStore = {
  state: "pending" | "complete";
  url: string;
  trigger: RouterEvent;
};

export const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
  subscribeWithSelector(
    immer(
      (): SpaRouterStore => ({
        state: "complete",
        url: isInContentScript() ? window.location.href : "",
        trigger: "push",
      }),
    ),
  ),
);
