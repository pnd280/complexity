import cloneDeep from "lodash/cloneDeep";

import { APP_CONFIG } from "@/app.config";
import FiberSearchService from "@/plugins/__core__/_main-world/fiber-search";
import {
  localInternalSearchStatesStatesFiberPath,
  localInternalSearchStatesValidateFiberPath,
} from "@/plugins/__core__/dom-observers/internal-search-states/remote-resources/fallback";
import type {
  InternalSearchStatesObserverStoreType,
  SearchStates,
} from "@/plugins/__core__/dom-observers/internal-search-states/store";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
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
  const statesFiberNode = await getStatesNodePath({
    remoteStatesFiberPath,
    remoteValidationFiberPath,
  });

  if (statesFiberNode == null) {
    throw new Error("[InternalSearchStates] States fiber node not found");
  }

  if (states.model != null) {
    statesFiberNode.setConfiguredModel(states.model);
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
}): Promise<SearchStates | null> {
  const statesFiberNode = await getStatesNodePath({
    remoteStatesFiberPath,
    remoteValidationFiberPath,
  });

  if (statesFiberNode == null) return null;

  return {
    sources: cloneDeep(statesFiberNode.sources) ?? [],
    model: statesFiberNode.configuredModel ?? null,
    searchMode: statesFiberNode.configuredSearchMode ?? "search",
  };
}

async function getStatesNodePath({
  remoteStatesFiberPath,
  remoteValidationFiberPath,
}: {
  remoteStatesFiberPath?: string[];
  remoteValidationFiberPath?: string[];
}) {
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
      rootElementSelector: (await DomSelectorsService.Instance.getCache()).ROOT,
      maxDepth: 100,
    },
  );

  if (fiberNode == null) {
    if (APP_CONFIG.IS_DEV) {
      console.error("❌ [InternalSearchStates] States fiber node not found");
    }

    return null;
  }

  return walkFiberNode(fiberNode, statesPath);
}
