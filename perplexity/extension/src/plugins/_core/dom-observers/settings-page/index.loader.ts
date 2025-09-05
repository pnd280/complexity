import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { observeSidebar } from "@/plugins/_core/dom-observers/settings-page/observers";
import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    settingsPage: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:settingsPage": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:settingsPage",
    dependencies: ["cache:pluginsStates", "cache:domSelectors"],
    loader: () => {
      spaRouteChangeCompleteSubscribe(
        (url) => {
          observeSettingsPage(whereAmI(url));
        },
        {
          immediate: true,
        },
      );
    },
  });
}

function cleanup() {
  domObserverService.unsubscribe(
    createDomObserverId("settingsPage", "topNavWrapper"),
  );
}

async function observeSettingsPage(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location !== "settings") {
    settingsPageDomObserverStore.getState().resetStore();
    return;
  }

  observeSidebar({
    observerId: createDomObserverId("settingsPage", "topNavWrapper"),
  });
}
