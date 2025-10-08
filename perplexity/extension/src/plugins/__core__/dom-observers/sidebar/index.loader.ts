import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import {
  observeMobileTrigger,
  observeSidebarWrapper,
} from "@/plugins/__core__/dom-observers/sidebar/observers";
import { domObserverService } from "@/services/features/dom-observer";
import { createDomObserverId } from "@/services/features/dom-observer/types";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:sidebar": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:sidebar",
    dependencies: ["cache:corePlugins:enableStates", "cache:domSelectors"],
    loader: ({ "cache:corePlugins:enableStates": corePluginsEnableStates }) => {
      if (!corePluginsEnableStates["domObservers:sidebar"]) return;

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
