import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
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
    !isLanguageModelCode(lastSelectedLanguageModel)
  ) {
    return;
  }

  setModelCookie({
    type: getModelType(lastSelectedLanguageModel),
    modelCode: lastSelectedLanguageModel,
  });

  useBetterLanguageModelSelectorStore
    .getState()
    .setModel(lastSelectedLanguageModel);
}

function syncFromInternalSearchStates(): void {
  internalSearchStatesObserverStore.subscribe(
    (state) => state.model,
    (model) => {
      if (model == null || !isLanguageModelCode(model)) {
        return;
      }

      useBetterLanguageModelSelectorStore.getState().setModel(model);
    },
  );
}

function syncToInternalSearchStates(): void {
  betterLanguageModelSelectorStore.subscribe(
    (state) => state.model,
    (model) => {
      if (model == null || !isLanguageModelCode(model)) {
        return;
      }

      internalSearchStatesObserverStore.getState().setInternalSearchStates({
        model: model,
      });

      setModelCookie({
        type: getModelType(model),
        modelCode: model,
      });
    },
  );
}
