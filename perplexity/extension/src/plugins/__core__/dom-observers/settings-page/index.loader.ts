import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { observeSidebar } from "@/plugins/__core__/dom-observers/settings-page/observers";
import { settingsPageDomObserverStore } from "@/plugins/__core__/dom-observers/settings-page/store";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:settingsPage": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:settingsPage",
    dependencies: ["cache:pluginsEnableStates", "cache:domSelectors"],
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
