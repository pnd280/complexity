import {
  observeCometAssistantQueryBox,
  observeFollowUpQueryBox,
  observeMainQueryBox,
  observeSpaceQueryBox,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/query-boxes/observers";
import { queryBoxesDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/query-boxes/store";
import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:queryBoxes": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:queryBoxes",
    dependencies: [
      "corePlugin:mainWorld:spaRouter",
      "cache:pluginsEnableStates",
      "cache:domSelectors",
    ],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:queryBoxes"]) return;

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
