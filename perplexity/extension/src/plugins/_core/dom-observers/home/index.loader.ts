import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { observeSlogan } from "@/plugins/_core/dom-observers/home/observers";
import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    home: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:home": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:home",
    dependencies: [
      "messaging:spaRouter",
      "cache:pluginsStates",
      "cache:domSelectors",
    ],
    loader: () => {
      // this observer is always needed for update announcer

      // if (
      //   !shouldEnableCoreObserver({
      //     coreObserverId: "coreDomObserver:home",
      //   })
      // )
      //   return;

      spaRouteChangeCompleteSubscribe(
        (url) => {
          observeHome(whereAmI(url));
        },
        {
          immediate: true,
        },
      );
    },
  });
}

function cleanup() {
  domObserverService.unsubscribe(createDomObserverId("home", "slogan"));
}

function observeHome(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location !== "home" && location !== "comet_ntp") {
    homeDomObserverStore.getState().resetStore();
    return;
  }

  observeSlogan({
    observerId: createDomObserverId("home", "slogan"),
  });
}
