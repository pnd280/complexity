import debounce from "lodash/debounce";

import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { DomObserversMainWorldActions } from "@/plugins/__core__/dom-observers/_main-world";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/fetched-resources";
import { internalSearchStatesObserverStore } from "@/plugins/__core__/dom-observers/internal-search-states/store";
import {
  isLanguageModelCode,
  isSearchMode,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "corePlugin:domObservers:internalSearchStates": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "corePlugin:domObservers:internalSearchStates",
    dependencies: ["cache:corePlugins:enableStates"],
    loader: ({ "cache:corePlugins:enableStates": corePluginsEnableStates }) => {
      if (!corePluginsEnableStates["domObservers:internalSearchStates"]) return;

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
