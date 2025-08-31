import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  findMobileTrigger,
  findSidebarWrapper,
} from "@/plugins/_core/dom-observers/sidebar/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    sidebar: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:sidebar": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:sidebar",
    dependencies: ["cache:pluginsStates", "cache:domSelectors"],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "sidebar",
        })
      )
        return;

      observeSidebar();
    },
  });
}

async function observeSidebar() {
  DomObserver.create(createDomObserverId("sidebar", "wrapper"), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findSidebarWrapper,
          id: createTaskId("sidebar", "wrapper"),
        },
        {
          callback: findMobileTrigger,
          id: createTaskId("sidebar", "mobile-trigger"),
        },
      ]),
  });
}
