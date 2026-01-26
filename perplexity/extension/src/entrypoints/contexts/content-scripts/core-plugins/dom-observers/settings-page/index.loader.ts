import { observeSidebar } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/settings-page/observers";
import { settingsPageDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/settings-page/store";
import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
