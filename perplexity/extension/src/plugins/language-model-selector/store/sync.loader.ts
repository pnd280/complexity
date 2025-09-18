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

export default function () {
  internalSearchStatesObserverStore.subscribe((state) => {
    if (
      state.selectedModel == null ||
      !isLanguageModelCode(state.selectedModel)
    )
      return;

    useBetterLanguageModelSelectorStore
      .getState()
      .setSelectedLanguageModel(state.selectedModel);
  });

  betterLanguageModelSelectorStore.subscribe((state) => {
    if (
      state.selectedLanguageModel == null ||
      !isLanguageModelCode(state.selectedLanguageModel)
    )
      return;

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
      type: isSearchLanguageModelCode(state.selectedLanguageModel)
        ? "search"
        : isResearchLanguageModelCode(state.selectedLanguageModel)
          ? "research"
          : "studio",
      modelCode: state.selectedLanguageModel,
    });
  });
}
