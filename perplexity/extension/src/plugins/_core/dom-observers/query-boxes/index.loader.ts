import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  findFollowUpQueryBox,
  findMainQueryBox,
  findSpaceQueryBox,
} from "@/plugins/_core/dom-observers/query-boxes/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/utils";
import type { MaybePromise } from "@/types/utils.types";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy(createDomObserverId("queryBoxes", "home"));
  DomObserver.destroy(createDomObserverId("queryBoxes", "collection"));
  DomObserver.destroy(createDomObserverId("queryBoxes", "followUp"));
};

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

      observeQueryBoxes(whereAmI());
      spaRouteChangeCompleteSubscribe((url) => {
        observeQueryBoxes(whereAmI(url));
      });
    },
  });
}

async function observeQueryBoxes(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverId: "queryBoxes",
    })
  )
    return;

  cleanup();

  const handlerMap: Partial<
    Record<ReturnType<typeof whereAmI>, () => MaybePromise<void>>
  > = {
    home: findMainQueryBox,
    comet_ntp: findMainQueryBox,
    collection: findSpaceQueryBox,
    thread: findFollowUpQueryBox,
  };

  const handler = handlerMap[location];

  if (!handler) return;

  DomObserver.create(createDomObserverId("queryBoxes", location), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        handler,
        createTaskId("queryBoxes", location),
      ),
  });
}
