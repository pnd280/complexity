import debounce from "lodash/debounce";

import { DomObserversMainWorldActions } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/_main-world";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/internal-search-states/remote-resources/fetched-resources";
import { internalSearchStatesObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/internal-search-states/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import {
  isLanguageModelCode,
  isSearchMode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:internalSearchStates": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:internalSearchStates",
    dependencies: ["cache:pluginsEnableStates"],
    loader: ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["domObservers:internalSearchStates"]) return;

      const observer = new MutationObserver(
        debounce(async () => {
          const states =
            await DomObserversMainWorldActions.Instance.getInternalSearchStates(
              {
                remoteValidationFiberPath:
                  remoteInternalSearchStatesValidateFiberPathStr.split("."),
                remoteStatesFiberPath:
                  remoteInternalSearchStatesStatesFiberPathStr.split("."),
              },
            );

          if (states == null) return;

          internalSearchStatesObserverStore.setState((store) => {
            store.sources = states.sources;

            if (states.model != null && isLanguageModelCode(states.model)) {
              store.model = states.model;
            }

            if (isSearchMode(states.searchMode)) {
              store.searchMode = states.searchMode;
            }
          });
        }, 100),
      );

      observer.observe(document.body, { childList: true, subtree: true });
    },
  });
}
