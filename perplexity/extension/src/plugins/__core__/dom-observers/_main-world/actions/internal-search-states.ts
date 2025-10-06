import deepClone from "lodash/cloneDeep";

import FiberSearchService from "@/plugins/__core__/_main-world/fiber-search";
import {
  localInternalSearchStatesStatesFiberPath,
  localInternalSearchStatesValidateFiberPath,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/fallback";
import type { InternalSearchStatesObserverStoreType } from "@/plugins/__core__/dom-observers/internal-search-states/store";
import { walkFiberNode } from "@/utils/wrappers/react-fiber";

export async function setInternalSearchStates({
  states,
  remoteValidationFiberPath,
  remoteStatesFiberPath,
}: {
  states: Partial<InternalSearchStatesObserverStoreType>;
  remoteValidationFiberPath?: string[];
  remoteStatesFiberPath?: string[];
}): Promise<void> {
  const statesFiberNode = getStatesNodePath({
    remoteStatesFiberPath,
    remoteValidationFiberPath,
  });

  if (statesFiberNode == null) {
    throw new Error("[InternalSearchStates] States fiber node not found");
  }

  if (states.selectedModel != null) {
    statesFiberNode.setConfiguredModel(states.selectedModel);
  }

  if (states.searchMode != null) {
    statesFiberNode.setConfiguredSearchMode(states.searchMode);
  }

  if (states.sources != null) {
    statesFiberNode.setSources(states.sources);
  }
}

export async function getInternalSearchStates({
  remoteStatesFiberPath,
  remoteValidationFiberPath,
}: {
  remoteValidationFiberPath?: string[];
  remoteStatesFiberPath?: string[];
}): Promise<InternalSearchStatesObserverStoreType | null> {
  const statesFiberNode = getStatesNodePath({
    remoteStatesFiberPath,
    remoteValidationFiberPath,
  });

  if (statesFiberNode == null) return null;

  return {
    sources: deepClone(statesFiberNode.sources) ?? [],
    selectedModel: statesFiberNode.configuredModel ?? null,
    searchMode: statesFiberNode.configuredSearchMode ?? "search",
  };
}

function getStatesNodePath({
  remoteStatesFiberPath,
  remoteValidationFiberPath,
}: {
  remoteStatesFiberPath?: string[];
  remoteValidationFiberPath?: string[];
}): any {
  const validationPath =
    remoteValidationFiberPath ?? localInternalSearchStatesValidateFiberPath;
  const statesPath =
    remoteStatesFiberPath ?? localInternalSearchStatesStatesFiberPath;

  const fiberNode = FiberSearchService.findFiberNodes(
    {
      fn: (fiber) => {
        const validationResult = walkFiberNode(fiber, validationPath);
        return validationResult != null;
      },
    },
    {
      rootElementSelector: "#root",
      maxDepth: 100,
    },
  );

  if (fiberNode == null) {
    return null;
  }

  return walkFiberNode(fiberNode, statesPath);
}
