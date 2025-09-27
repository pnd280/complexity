import debounce from "lodash/debounce";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/plugins/_core/dom-observers/internal-search-states/remote-resources/fetched-resources";
import { internalSearchStatesObserverStore } from "@/plugins/_core/dom-observers/internal-search-states/store";
import { shouldEnableCoreDomObserver } from "@/plugins/_core/dom-observers/utils";
import { ReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";
import {
  isLanguageModelCode,
  isSearchMode,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    internalSearchStates: void;
  }
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:internalSearchStates": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:internalSearchStates",
    dependencies: ["cache:pluginsStates"],
    loader: () => {
      if (
        !shouldEnableCoreDomObserver({
          coreObserverId: "internalSearchStates",
        })
      )
        return;

      const observer = new MutationObserver(
        debounce(async () => {
          const states =
            await ReactVdomService.Instance.getInternalSearchStates({
              remoteValidationFiberPath:
                remoteInternalSearchStatesValidateFiberPathStr.split("."),
              remoteStatesFiberPath:
                remoteInternalSearchStatesStatesFiberPathStr.split("."),
            });

          if (states == null) return;

          internalSearchStatesObserverStore.setState((store) => {
            store.sources = states.sources;

            if (
              states.selectedModel != null &&
              isLanguageModelCode(states.selectedModel)
            ) {
              store.selectedModel = states.selectedModel;
            }

            if (states.searchMode != null && isSearchMode(states.searchMode)) {
              store.searchMode = states.searchMode;
            }
          });
        }, 100),
      );

      observer.observe(document.body, { childList: true, subtree: true });
    },
  });
}
