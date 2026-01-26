import { internalSearchStatesObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/internal-search-states/store";
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { setModelCookie } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/utils";
import {
  isLanguageModelCode,
  isSearchLanguageModelCode,
  isResearchLanguageModelCode,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/predicates";
import type {
  LanguageModelCode,
  LanguageModelType,
} from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/types";
import {
  betterLanguageModelSelectorStore,
  useBetterLanguageModelSelectorStore,
} from "@/plugins/language-model-selector/store";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
    "cplx:lastSelectedLanguageModel",
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
    (store) => store.model,
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
    (store) => store.model,
    (model) => {
      if (!isLanguageModelCode(model)) {
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
