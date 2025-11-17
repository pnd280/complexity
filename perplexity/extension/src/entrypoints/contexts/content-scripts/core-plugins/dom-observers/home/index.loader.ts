import { observeSlogan } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/home/observers";
import { homeDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/home/store";
import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:home": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:home",
    dependencies: [
      "corePlugin:mainWorld:spaRouter",
      "cache:pluginsEnableStatesV2",
      "cache:domSelectors",
    ],
    loader: () => {
      // always enabled
      // if (
      //   !shouldEnableCorePlugin({
      //     corePluginId: "domObservers:home",
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
