import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import { observeSidebar } from "@/plugins/__core__/dom-observers/settings-page/observers";
import { settingsPageDomObserverStore } from "@/plugins/__core__/dom-observers/settings-page/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
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
          void observeSettingsPage(whereAmI(url));
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
