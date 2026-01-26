import {
  observeNavbarOverflowMenuButtonWrapper,
  observeNavbar,
  observeWrapper,
  observeMessageBlocksWrapper,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/observers";
import { threadDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/store";
import { spaRouteChangeCompleteSubscribe } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:thread": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:thread",
    dependencies: [
      "corePlugin:mainWorld:spaRouter",
      "corePlugin:domObservers:mainWorldActions",
      "cache:pluginsEnableStates",
      "cache:domSelectors",
    ],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:thread"]) return;

      spaRouteChangeCompleteSubscribe(
        (url) => {
          observeThread(whereAmI(url));
        },
        {
          immediate: true,
        },
      );
    },
  });
}

function cleanup() {
  domObserverService.unsubscribe(createDomObserverId("thread", "navbar"));
  domObserverService.unsubscribe(
    createDomObserverId("thread", "navbarOverflowMenuButton"),
  );
  domObserverService.unsubscribe(createDomObserverId("thread", "wrapper"));
  domObserverService.unsubscribe(
    createDomObserverId("thread", "messageBlocksWrapper"),
  );
}

function observeThread(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location === "thread") {
    observeNavbar({
      observerId: createDomObserverId("thread", "navbar"),
    });

    observeNavbarOverflowMenuButtonWrapper({
      observerId: createDomObserverId("thread", "navbarOverflowMenuButton"),
    });

    observeWrapper({
      observerId: createDomObserverId("thread", "wrapper"),
    });

    observeMessageBlocksWrapper({
      observerId: createDomObserverId("thread", "messageBlocksWrapper"),
    });
  } else if (location === "comet_assistant") {
    observeWrapper({
      observerId: createDomObserverId("thread", "wrapper"),
    });

    observeMessageBlocksWrapper({
      observerId: createDomObserverId("thread", "messageBlocksWrapper"),
    });
  } else {
    threadDomObserverStore.getState().resetStore();
  }
}
