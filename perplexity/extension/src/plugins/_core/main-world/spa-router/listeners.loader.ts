import { onMessage } from "webext-bridge/content-script";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  createWithEqualityFn,
  useStoreWithEqualityFn,
} from "zustand/traditional";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type { RouterEvent } from "@/plugins/_core/main-world/spa-router/spa-router.types";
import { isInContentScript } from "@/utils/utils";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "spaRouter:route-change": (params: {
      state: "pending" | "complete";
      trigger: RouterEvent;
      newUrl: string;
    }) => void;
  }
}

onlyExtensionGuard();

function setupSpaRouterDispatchListeners() {
  onMessage(
    "spaRouter:route-change",
    ({ data: { state, trigger, newUrl } }) => {
      spaRouterStore.setState({ state, url: newUrl, trigger });
    },
  );
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "messaging:spaRouter": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "messaging:spaRouter",
    dependencies: [],
    loader: () => {
      setupSpaRouterDispatchListeners();
    },
  });
}

type SpaRouterStore = {
  state: "pending" | "complete";
  url: string;
  trigger: RouterEvent;
};

const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
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

export const spaRouterStoreSubscribe = spaRouterStore.subscribe;

export const spaRouteChangeCompleteSubscribe = (
  callback: (url: string) => void,
) => {
  return spaRouterStore.subscribe(
    (store) => ({ state: store.state, url: store.url }),
    ({ state, url }) => {
      if (state === "complete") callback(url);
    },
  );
};

export const useSpaRouter = <T = SpaRouterStore>(
  selector?: (state: SpaRouterStore) => T,
) => {
  return useStoreWithEqualityFn(
    spaRouterStore,
    selector ??
      ((state) =>
        ({
          url: state.url,
          trigger: state.trigger,
        }) as T),
  );
};
