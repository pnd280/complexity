import { useStoreWithEqualityFn } from "zustand/traditional";

import { locationWaits } from "@/plugins/__core__/_main-world/spa-router/location-waits";
import { SpaRouterService } from "@/plugins/__core__/_main-world/spa-router/service/service-init";
import {
  spaRouterStore,
  type SpaRouterStore,
} from "@/plugins/__core__/_main-world/spa-router/store";
import type { MaybePromise } from "@/types/utils.types";
import { waitForSpaIdle } from "@/utils/dom-utils/generics";
import { type whereAmI } from "@/utils/misc/utils";

export function applyRouteIdAttribute(location: ReturnType<typeof whereAmI>) {
  $(document.body).attr("location", location);
}

export async function waitForRouteChangeComplete(
  location: ReturnType<typeof whereAmI>,
) {
  const check = locationWaits[location] ?? waitForSpaIdle;

  await waitForConditionOrTimeout(check);

  async function waitForConditionOrTimeout(
    condition: () => MaybePromise<boolean>,
    timeout = 3000,
    interval = 100,
  ) {
    let timeoutReached = false;

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        timeoutReached = true;
        resolve(undefined);
      }, timeout);
    });

    const checkCondition = async () => {
      while (!timeoutReached && !(await condition())) {
        await sleep(interval);
      }
    };

    await Promise.race([checkCondition(), timeoutPromise]);
  }
}

export async function softNavigate(url: string) {
  void SpaRouterService.Instance.push(url);
}

export async function openInNewTab(url: string) {
  void SpaRouterService.Instance.openInNewTab(url);
}

export const spaRouterStoreSubscribe = spaRouterStore.subscribe;

export const spaRouteChangeCompleteSubscribe = (
  callback: (url: string) => void,
  options: {
    immediate?: boolean;
  } = {},
) => {
  if (options.immediate) {
    callback(spaRouterStore.getState().url);
  }

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
