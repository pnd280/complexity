import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import {
  observeCometAssistantQueryBox,
  observeFollowUpQueryBox,
  observeMainQueryBox,
  observeSpaceQueryBox,
} from "@/plugins/__core__/dom-observers/query-boxes/observers";
import { queryBoxesDomObserverStore } from "@/plugins/__core__/dom-observers/query-boxes/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:queryBoxes": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:queryBoxes",
    dependencies: [
      "corePlugin:mainWorld:spaRouter",
      "cache:corePlugins:enableStates",
      "cache:domSelectors",
    ],
    loader: ({ "cache:corePlugins:enableStates": corePluginsEnableStates }) => {
      if (!corePluginsEnableStates["domObservers:queryBoxes"]) return;

      spaRouteChangeCompleteSubscribe(
        (url) => {
          observeQueryBoxes(whereAmI(url));
        },
        {
          immediate: true,
        },
      );
    },
  });
}

function cleanup() {
  domObserverService.unsubscribe(createDomObserverId("queryBoxes", "home"));
  domObserverService.unsubscribe(
    createDomObserverId("queryBoxes", "comet_ntp"),
  );
  domObserverService.unsubscribe(
    createDomObserverId("queryBoxes", "collection"),
  );
  domObserverService.unsubscribe(createDomObserverId("queryBoxes", "thread"));
  domObserverService.unsubscribe(
    createDomObserverId("queryBoxes", "comet_assistant"),
  );
}

function observeQueryBoxes(location: ReturnType<typeof whereAmI>) {
  cleanup();

  switch (location) {
    case "home":
    case "comet_ntp":
      observeMainQueryBox({
        observerId: createDomObserverId("queryBoxes", location),
      });
      break;
    case "collection":
      observeSpaceQueryBox({
        observerId: createDomObserverId("queryBoxes", location),
      });
      break;
    case "thread":
      observeFollowUpQueryBox({
        observerId: createDomObserverId("queryBoxes", location),
      });
      break;
    case "comet_assistant":
      observeCometAssistantQueryBox({
        observerId: createDomObserverId("queryBoxes", location),
      });
      break;
    default:
      queryBoxesDomObserverStore.getState().resetStore();
  }
}
