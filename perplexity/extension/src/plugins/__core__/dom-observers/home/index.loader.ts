import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { observeSlogan } from "@/plugins/__core__/dom-observers/home/observers";
import { homeDomObserverStore } from "@/plugins/__core__/dom-observers/home/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:home": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:home",
    dependencies: [
      "corePlugin:mainWorld:spaRouter",
      "cache:pluginsEnableStates",
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
