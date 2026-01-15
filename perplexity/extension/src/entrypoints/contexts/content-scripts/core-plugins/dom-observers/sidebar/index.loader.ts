import {
  observeMobileTrigger,
  observeSidebarWrapper,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/sidebar/observers";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:sidebar": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:sidebar",
    dependencies: ["cache:pluginsEnableStates", "cache:domSelectors"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:sidebar"]) return;

      void observeSidebar();
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
