import deepClone from "lodash/cloneDeep";

import {
  localInternalSearchStatesStatesFiberPath,
  localInternalSearchStatesValidateFiberPath,
} from "@/plugins/_core/dom-observers/internal-search-states/remote-resources/fallback";
import type { InternalSearchStatesObserverStoreType } from "@/plugins/_core/dom-observers/internal-search-states/store";
import { walkFiberNode } from "@/plugins/_core/main-world/react-vdom/utils";

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

const cache: {
  cachedStatesFiberNode: any;
  cachedPath: string | null;
} = {
  cachedStatesFiberNode: null,
  cachedPath: null,
};

function getStatesNodePath({
  remoteStatesFiberPath,
  remoteValidationFiberPath,
}: {
  remoteStatesFiberPath?: string[];
  remoteValidationFiberPath?: string[];
}): any {
  if (cache.cachedStatesFiberNode != null) {
    const result = walkFiberNode(
      cache.cachedStatesFiberNode,
      remoteStatesFiberPath ?? localInternalSearchStatesStatesFiberPath,
    );
    if (result != null) {
      return result;
    }
    clearCache();
  }

  const path = findFiberNodePath({ remoteValidationFiberPath });
  if (path == null) {
    return null;
  }

  const rootElement = document.getElementById("root");
  if (rootElement == null) {
    return null;
  }

  cache.cachedStatesFiberNode = walkFiberNode(rootElement, path.split("."));
  cache.cachedPath = path;

  if (cache.cachedStatesFiberNode == null) {
    return null;
  }

  return walkFiberNode(
    cache.cachedStatesFiberNode,
    remoteStatesFiberPath ?? localInternalSearchStatesStatesFiberPath,
  );
}

function clearCache(): void {
  cache.cachedStatesFiberNode = null;
  cache.cachedPath = null;
}

function findFiberNodePath({
  remoteValidationFiberPath,
}: {
  remoteValidationFiberPath?: string[];
}): string | null {
  const rootElement = document.getElementById("root");
  if (rootElement == null) {
    console.warn("[InternalSearchStates] Root element not found");
    return null;
  }

  const containerKey = Object.keys(rootElement).find((key) =>
    key.startsWith("__reactContainer$"),
  );

  if (containerKey == null) {
    console.warn("[InternalSearchStates] React container not found");
    return null;
  }

  const rootFiber = (rootElement[containerKey as keyof HTMLElement] as any)
    ?.alternate;

  if (rootFiber == null) {
    console.warn("[InternalSearchStates] Root fiber not found");
    return null;
  }

  return traverseFiberTree({
    rootFiber,
    containerKey,
    validationPath:
      remoteValidationFiberPath ?? localInternalSearchStatesValidateFiberPath,
  });
}

function traverseFiberTree({
  rootFiber,
  containerKey,
  validationPath,
}: {
  rootFiber: any;
  containerKey: string;
  validationPath: string[];
}): string | null {
  const MAX_DEPTH = 100;
  const queue = [
    { node: rootFiber, path: `${containerKey}.alternate`, depth: 0 },
  ];
  const visited = new WeakSet();
  let maxDepthReached = false;

  while (queue.length > 0) {
    const current = queue.shift();
    if (current == null) continue;

    const { node: currentNode, path, depth } = current;

    if (currentNode == null || visited.has(currentNode)) continue;

    if (depth >= MAX_DEPTH) {
      maxDepthReached = true;
      continue;
    }
    visited.add(currentNode);

    if (walkFiberNode(currentNode, validationPath) != null) {
      return path;
    }

    if (currentNode.child != null) {
      queue.push({
        node: currentNode.child,
        path: `${path}.child`,
        depth: depth + 1,
      });
    }

    if (currentNode.sibling != null) {
      queue.push({
        node: currentNode.sibling,
        path: `${path}.sibling`,
        depth: depth + 1,
      });
    }
  }

  if (maxDepthReached) {
    console.warn(
      `[InternalSearchStates] Maximum traversal depth (${MAX_DEPTH}) reached but target node not found. ` +
        `Validation path: ${validationPath.join(".")}`,
    );
  }

  return null;
}
