import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { DomObserversMainWorldActions } from "@/plugins/__core__/dom-observers/_main-world";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/fetched-resources";
import { internalSearchStatesObserverStore } from "@/plugins/__core__/dom-observers/internal-search-states/store";
import { setModelCookie } from "@/plugins/__ui-groups__/elements/query-box/utils";
import {
  betterLanguageModelSelectorStore,
  useBetterLanguageModelSelectorStore,
} from "@/plugins/language-model-selector/store";
import {
  isLanguageModelCode,
  isSearchLanguageModelCode,
  isResearchLanguageModelCode,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import { waitUntil } from "@/utils/misc/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:languageModelSelector:sync": void;
  }
}

export default function (): void {
  AsyncLoaderRegistry.register({
    id: "plugin:queryBox:languageModelSelector:sync",
    dependencies: ["cache:pluginsEnableStates", "cache:languageModels"],
    loader: async ({ "cache:pluginsEnableStates": pluginsEnableStates }) => {
      if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

      await waitUntil({
        condition: () => DomObserversMainWorldActions.Instance.isInitialized(),
        timeout: 5000,
        interval: 100,
      });

      syncToInternalSearchStates();

      setTimeout(() => {
        syncFromInternalSearchStates();
      }, 1000);

      initializeFromCookie();
    },
  });
}

function getModelType(modelCode: LanguageModelCode): LanguageModelType {
  if (isSearchLanguageModelCode(modelCode)) return "search";
  if (isResearchLanguageModelCode(modelCode)) return "research";
  return "studio";
}

function initializeFromCookie(): void {
  const lastSelectedLanguageModel = localStorage.getItem(
    "cplx.last-selected-language-model",
  );

  if (
    !lastSelectedLanguageModel ||
    !isSearchLanguageModelCode(lastSelectedLanguageModel)
  ) {
    return;
  }

  setModelCookie({
    type: getModelType(lastSelectedLanguageModel),
    modelCode: lastSelectedLanguageModel,
  });

  useBetterLanguageModelSelectorStore
    .getState()
    .setSelectedLanguageModel(lastSelectedLanguageModel);
}

function syncFromInternalSearchStates(): void {
  internalSearchStatesObserverStore.subscribe((state) => {
    if (
      state.selectedModel == null ||
      !isLanguageModelCode(state.selectedModel)
    ) {
      return;
    }

    useBetterLanguageModelSelectorStore
      .getState()
      .setSelectedLanguageModel(state.selectedModel);
  });
}

function syncToInternalSearchStates(): void {
  betterLanguageModelSelectorStore.subscribe((state) => {
    if (
      state.selectedLanguageModel == null ||
      !isLanguageModelCode(state.selectedLanguageModel)
    ) {
      return;
    }

    DomObserversMainWorldActions.Instance.setInternalSearchStates({
      states: {
        selectedModel: state.selectedLanguageModel,
      },
      remoteValidationFiberPath:
        remoteInternalSearchStatesValidateFiberPathStr.split("."),
      remoteStatesFiberPath:
        remoteInternalSearchStatesStatesFiberPathStr.split("."),
    });

    setModelCookie({
      type: getModelType(state.selectedLanguageModel),
      modelCode: state.selectedLanguageModel,
    });
  });
}
