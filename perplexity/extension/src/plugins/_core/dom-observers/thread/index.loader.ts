import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  observeNavbarOverflowMenuButtonWrapper,
  observeNavbar,
  observePopper,
  observeWrapper,
  observePageWrapper,
  observeMessageBlocksWrapper,
} from "@/plugins/_core/dom-observers/thread/observers";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";
import { waitUntil, whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    thread: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:thread": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:thread",
    dependencies: [
      "messaging:spaRouter",
      "cache:pluginsStates",
      "cache:domSelectors",
      "plugins:mainWorldCorePlugins:domSelectorsDependants",
    ],
    loader: async () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "thread",
        })
      )
        return;

      await waitUntil({
        interval: 50,
        timeout: 2000,
        condition: async () => {
          return await getReactVdomService().isInitialized();
        },
      });

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
  domObserverService.unsubscribe(createDomObserverId("thread", "pageWrapper"));
  domObserverService.unsubscribe(createDomObserverId("thread", "navbar"));
  domObserverService.unsubscribe(
    createDomObserverId("thread", "navbarOverflowMenuButton"),
  );
  domObserverService.unsubscribe(createDomObserverId("thread", "wrapper"));
  domObserverService.unsubscribe(
    createDomObserverId("thread", "messageBlocksWrapper"),
  );
  domObserverService.unsubscribe(createDomObserverId("thread", "popper"));
}

function observeThread(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location === "thread") {
    observePageWrapper({
      observerId: createDomObserverId("thread", "pageWrapper"),
    });

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

    observePopper({
      observerId: createDomObserverId("thread", "popper"),
    });
  } else if (location === "comet_assistant") {
    observePageWrapper({
      observerId: createDomObserverId("thread", "pageWrapper"),
    });

    observeWrapper({
      observerId: createDomObserverId("thread", "wrapper"),
    });

    observeMessageBlocksWrapper({
      observerId: createDomObserverId("thread", "messageBlocksWrapper"),
    });
  } else {
    threadDomObserverStore.getState().resetStore();

    $(
      getDomSelectorsRootService().cplxAttribute(
        getDomSelectorsRootService().internalAttributes.THREAD.PAGE_WRAPPER,
      ),
    ).internalComponentAttr(null);
  }
}
