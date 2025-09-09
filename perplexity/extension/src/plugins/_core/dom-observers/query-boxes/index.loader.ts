import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  observeFollowUpQueryBox,
  observeMainQueryBox,
  observeSpaceQueryBox,
} from "@/plugins/_core/dom-observers/query-boxes/observers";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    queryBoxes: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:queryBoxes": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:queryBoxes",
    dependencies: [
      "cache:pluginsStates",
      "messaging:spaRouter",
      "cache:domSelectors",
    ],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "queryBoxes",
        })
      )
        return;

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
}

function observeQueryBoxes(location: ReturnType<typeof whereAmI>) {
  cleanup();

  const observerMap: Partial<
    Record<
      ReturnType<typeof whereAmI>,
      ({ observerId }: { observerId: string }) => () => void
    >
  > = {
    home: observeMainQueryBox,
    comet_ntp: observeMainQueryBox,
    collection: observeSpaceQueryBox,
    thread: observeFollowUpQueryBox,
  };

  const handler = observerMap[location];

  if (handler == null) {
    queryBoxesDomObserverStore.getState().resetStore();
    return;
  }

  handler({
    observerId: createDomObserverId("queryBoxes", location),
  });
}
