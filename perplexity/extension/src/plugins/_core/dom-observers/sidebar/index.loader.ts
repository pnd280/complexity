import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  observeMobileTrigger,
  observeSidebarWrapper,
} from "@/plugins/_core/dom-observers/sidebar/observers";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

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

function cleanup() {
  domObserverService.unsubscribe(createDomObserverId("sidebar", "wrapper"));
  domObserverService.unsubscribe(
    createDomObserverId("sidebar", "mobile-trigger"),
  );
}

async function observeSidebar() {
  cleanup();

  observeSidebarWrapper({
    observerId: createDomObserverId("sidebar", "wrapper"),
  });

  observeMobileTrigger({
    observerId: createDomObserverId("sidebar", "mobile-trigger"),
  });
}
