import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { findSlogan } from "@/plugins/_core/dom-observers/home/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    home: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:home": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:home",
    dependencies: [
      "messaging:spaRouter",
      "cache:pluginsStates",
      "cache:domSelectors",
    ],
    loader: () => {
      // this observer is always needed for update announcer

      // if (
      //   !shouldEnableCoreObserver({
      //     coreObserverId: "coreDomObserver:home",
      //   })
      // )
      //   return;

      observeHome(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        observeHome(whereAmI(url));
      });
    },
  });
}

const cleanup = () => {
  DomObserver.destroy(createDomObserverId("home"));
};

function observeHome(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location !== "home" && location !== "comet_ntp") return;

  DomObserver.create(createDomObserverId("home"), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        { callback: findSlogan, id: createTaskId("home", "slogan") },
      ]),
  });
}
