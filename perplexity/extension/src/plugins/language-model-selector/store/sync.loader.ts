import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import {
  remoteInternalSearchStatesStatesFiberPathStr,
  remoteInternalSearchStatesValidateFiberPathStr,
} from "@/plugins/_core/dom-observers/internal-search-states/remote-resources/fetched-resources";
import { internalSearchStatesObserverStore } from "@/plugins/_core/dom-observers/internal-search-states/store";
import { getReactVdomService } from "@/plugins/_core/main-world/react-vdom/service/service-init";
import { setModelCookie } from "@/plugins/_core/ui/groups/query-box/utils";
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

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:languageModelSelector:sync": void;
  }
}

export default function (): void {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:languageModelSelector:sync",
    dependencies: ["cache:pluginsStates", "cache:languageModels"],
    loader: () => {
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

    getReactVdomService().setInternalSearchStates(
      {
        selectedModel: state.selectedLanguageModel,
      },
      {
        remoteValidationFiberPath:
          remoteInternalSearchStatesValidateFiberPathStr.split("."),
        remoteStatesFiberPath:
          remoteInternalSearchStatesStatesFiberPathStr.split("."),
      },
    );

    setModelCookie({
      type: getModelType(state.selectedLanguageModel),
      modelCode: state.selectedLanguageModel,
    });
  });
}
