import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { DomObserver } from "@/plugins/_core/dom-observers/_service";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_core/dom-observers/_service/callback-queue";
import { createDomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import {
  findNavbarOverflowMenuButtonWrapper,
  findNavbar,
  findPopper,
  findWrapper,
  findPageWrapper,
  findMessageBlocksWrapper,
} from "@/plugins/_core/dom-observers/thread/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
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

      observeThread(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        observeThread(whereAmI(url));
      });
    },
  });
}

function cleanup() {
  DomObserver.destroy(createDomObserverId("thread"));
  threadDomObserverStore.getState().resetStore();

  $(
    getDomSelectorsRootService().cplxAttribute(
      getDomSelectorsRootService().internalAttributes.THREAD.PAGE_WRAPPER,
    ),
  ).internalComponentAttr(null);
}

function observeThread(location: ReturnType<typeof whereAmI>) {
  if (location === "thread") {
    DomObserver.create(createDomObserverId("thread"), {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: () => {
        CallbackQueue.getInstance().enqueueArray([
          {
            id: createTaskId("thread", "pageWrapper"),
            callback: findPageWrapper,
          },
          {
            id: createTaskId("thread", "navbar"),
            callback: findNavbar,
          },
          {
            id: createTaskId("thread", "navbarOverflowMenuButton"),
            callback: findNavbarOverflowMenuButtonWrapper,
          },
          {
            id: createTaskId("thread", "wrapper"),
            callback: findWrapper,
          },
          {
            id: createTaskId("thread", "messageBlocksWrapper"),
            callback: findMessageBlocksWrapper,
          },
          {
            id: createTaskId("thread", "popper"),
            callback: findPopper,
          },
        ]);
      },
    });
  } else if (location === "comet_assistant") {
    DomObserver.create(createDomObserverId("thread"), {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: () => {
        CallbackQueue.getInstance().enqueueArray([
          {
            id: createTaskId("thread", "pageWrapper"),
            callback: findPageWrapper,
          },
          {
            id: createTaskId("thread", "wrapper"),
            callback: findWrapper,
          },
          {
            id: createTaskId("thread", "messageBlocksWrapper"),
            callback: findMessageBlocksWrapper,
          },
        ]);
      },
    });
  } else {
    cleanup();
  }
}
