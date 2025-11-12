import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import type { RouterEvent } from "@/plugins/__core__/_main-world/spa-router/spa-router.types";
import { isInContentScript } from "@/utils/misc/utils";

export type SpaRouterStore = {
  state: "pending" | "complete";
  url: string;
  trigger: RouterEvent;
};

export const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
  subscribeWithSelector(
    mutative(
      (): SpaRouterStore => ({
        state: "complete",
        url: isInContentScript() ? window.location.href : "",
        trigger: "push",
      }),
    ),
  ),
);
