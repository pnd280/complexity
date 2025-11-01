import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/__core__/_main-world/spa-router/utils";
import { domObserverService } from "@/plugins/__core__/dom-observers";
import {
  observeNavbarOverflowMenuButtonWrapper,
  observeNavbar,
  observeWrapper,
  observeMessageBlocksWrapper,
} from "@/plugins/__core__/dom-observers/thread/observers";
import { threadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { createDomObserverId } from "@/plugins/__core__/dom-observers/types";
import { whereAmI } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
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
      "cache:corePlugins:enableStates",
      "cache:domSelectors",
    ],
    loader: async ({
      "cache:corePlugins:enableStates": corePluginsEnableStates,
    }) => {
      if (!corePluginsEnableStates["domObservers:thread"]) return;

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
