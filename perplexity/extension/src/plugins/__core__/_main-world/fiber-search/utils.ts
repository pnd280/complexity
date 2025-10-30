export type Fiber = {
  type: unknown;
  elementType?: unknown;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  [key: string]: unknown;
};

type CacheKey = string;
type FiberPath = {
  directions: ("child" | "sibling")[];
};
type CacheValue = {
  paths: FiberPath[] | null;
  rootElement: Element;
};

const searchCache = new Map<CacheKey, CacheValue>();

function followPath(root: Fiber, path: FiberPath): Fiber | null {
  let current: Fiber | null = root;
  for (const direction of path.directions) {
    if (current == null) return null;
    current = current[direction];
  }
  return current;
}

function pathToString(path: FiberPath): string {
  return path.directions.join(".");
}

function generateCacheKey(
  condition: FiberSearchCondition,
  options: NameSearchOptions | BaseFiberSearchOptions,
): CacheKey {
  const conditionKey =
    "name" in condition
      ? `name:${condition.name}${condition.fn ? `:fn:${condition.fn.toString()}` : ""}`
      : `fn:${condition.fn.toString()}`;

  const optionsKey = [
    options.rootElementSelector,
    options.maxDepth ?? "Infinity",
    options.findAll ?? false,
    "exact" in options ? (options.exact ?? false) : false,
    "expectSameDepth" in options ? (options.expectSameDepth ?? false) : false,
  ].join("|");

  return `${conditionKey}::${optionsKey}`;
}

export type NameSearchCondition = {
  /**
   * Component name to search for. Matches against component displayName, name, or element type.
   * Uses case-insensitive substring matching unless `exact` option is true.
   */
  name: string;
  /**
   * Custom predicate function. If both name and fn are provided, uses OR semantics.
   */
  fn?: (node: Fiber) => boolean;
};

export type FunctionSearchCondition = {
  fn: (node: Fiber) => boolean;
};

export type FiberSearchCondition =
  | NameSearchCondition
  | FunctionSearchCondition;

type CommonFiberSearchOptions = {
  /**
   * CSS selector for the root DOM element to start the search from.
   * The element should have a React fiber attached (__reactFiber$ or __reactContainer$).
   */
  rootElementSelector: string;
  /** @default Infinity */
  maxDepth?: number;
  /**
   * Whether to cache search results. Subsequent searches with identical arguments
   * will return cached results without traversing the fiber tree again.
   * @default true
   */
  cache?: boolean;
  /** @default false */
  profile?: boolean;
};

export type SingleResultOptions = CommonFiberSearchOptions & {
  findAll?: false;
};

export type MultipleResultsOptions = CommonFiberSearchOptions & {
  findAll: true;
  /**
   * Only search at the same depth level as the first match.
   * @default false
   */
  expectSameDepth?: boolean;
};

type BaseFiberSearchOptions = SingleResultOptions | MultipleResultsOptions;

export type NameSearchSingleOptions = SingleResultOptions & {
  /**
   * Whether to perform exact name matching (case-sensitive).
   * When false, uses case-insensitive substring matching.
   * @default false
   */
  exact?: boolean;
};

export type NameSearchMultipleOptions = MultipleResultsOptions & {
  /**
   * Whether to perform exact name matching (case-sensitive).
   * When false, uses case-insensitive substring matching.
   * @default false
   */
  exact?: boolean;
};

type NameSearchOptions = NameSearchSingleOptions | NameSearchMultipleOptions;

type ElementWithFiberCache = Element & {
  _best_fk?: string;
  [key: string]: unknown;
};

function getFiberFromElement(element: Element): Fiber | null {
  const rootElWithCache = element as ElementWithFiberCache;
  let fiberKey = rootElWithCache._best_fk;

  if (typeof fiberKey !== "string") {
    const keys = Object.keys(rootElWithCache);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof key === "string" && key.startsWith("__reactFiber$")) {
        fiberKey = key;
        rootElWithCache._best_fk = key;
        break;
      }
    }
    if (typeof fiberKey !== "string") {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (typeof key === "string" && key.startsWith("__reactContainer$")) {
          fiberKey = key;
          rootElWithCache._best_fk = key;
          break;
        }
      }
    }
  }

  if (typeof fiberKey !== "string") {
    console.warn(
      "No __reactFiber$* or __reactContainer$* property found on element",
    );
    return null;
  }

  return (rootElWithCache[fiberKey] as Fiber | undefined) ?? null;
}

function createComponentNameGetter() {
  const typeToNameCache =
    typeof WeakMap === "function" ? new WeakMap<object, string>() : null;

  return function getComponentNameFromFiber(
    fiber: Fiber | null,
  ): string | null {
    if (fiber == null) return null;
    const type = fiber.type;
    if (type == null) return null;

    if (typeof type === "string") return type;

    if (
      typeToNameCache != null &&
      typeof type === "object" &&
      typeToNameCache.has(type)
    ) {
      return typeToNameCache.get(type) ?? null;
    }

    let name: string | null = null;
    if (typeof type === "object" || typeof type === "function") {
      const typeWithName = type as {
        displayName?: string;
        name?: string;
        render?: { name?: string };
      };

      if (typeWithName.displayName) {
        name = typeWithName.displayName;
      } else if (typeWithName.name) {
        name = typeWithName.name;
      } else if (typeWithName.render?.name) {
        name = typeWithName.render.name;
      } else if (fiber.elementType != null) {
        const elemType = fiber.elementType as
          | {
              displayName?: string;
              name?: string;
            }
          | undefined;
        name = elemType?.displayName || elemType?.name || null;
      }
    }

    if (typeToNameCache != null && name != null && typeof type === "object") {
      typeToNameCache.set(type, name);
    }
    return name;
  };
}

function createNodeMatcher(params: {
  condition: FiberSearchCondition;
  exact: boolean;
  hasName: boolean;
  hasFn: boolean;
  getComponentNameFromFiber: (fiber: Fiber) => string | null;
}) {
  const { condition, exact, hasName, hasFn, getComponentNameFromFiber } =
    params;
  const searchName = hasName && "name" in condition ? condition.name : null;
  const searchNameLower = hasName && !exact ? searchName!.toLowerCase() : null;

  return function nodeMatches(node: Fiber): boolean {
    if (hasName) {
      const componentName = getComponentNameFromFiber(node);
      if (componentName) {
        if (exact) {
          if (componentName === searchName) return true;
        } else {
          if (componentName.toLowerCase().includes(searchNameLower!))
            return true;
        }
      }
      if (!hasFn) return false;
    }

    if (hasFn) {
      try {
        return !!condition.fn!(node);
      } catch {
        return false;
      }
    }

    return false;
  };
}

type VisitedNodesRef = { current: number };

function searchAllFibers(params: {
  startFiber: Fiber;
  nodeMatches: (node: Fiber) => boolean;
  maxDepth: number;
  expectSameDepth: boolean;
  visitedNodesRef: VisitedNodesRef;
}) {
  const {
    startFiber,
    nodeMatches,
    maxDepth,
    expectSameDepth,
    visitedNodesRef,
  } = params;
  const resultPaths: FiberPath[] = [];
  const stackNodes: (Fiber | null)[] = [startFiber];
  const stackDepths: number[] = [0];
  const stackPaths: ("child" | "sibling")[][] = [[]];
  let targetDepth: number | null = null;

  while (stackNodes.length) {
    const node = stackNodes.pop();
    const depth = stackDepths.pop();
    const currentPath = stackPaths.pop();
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      depth > maxDepth
    )
      continue;

    if (expectSameDepth && targetDepth != null && depth !== targetDepth) {
      continue;
    }

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      resultPaths.push({ directions: currentPath });
      if (expectSameDepth && targetDepth == null) {
        targetDepth = depth;
      }
    }

    const sibling = node.sibling;
    if (sibling != null) {
      stackNodes.push(sibling);
      stackDepths.push(depth);
      stackPaths.push([...currentPath, "sibling"]);
    }
    const child = node.child;
    if (child != null && (!expectSameDepth || targetDepth == null)) {
      stackNodes.push(child);
      stackDepths.push(depth + 1);
      stackPaths.push([...currentPath, "child"]);
    }
  }

  return resultPaths;
}

function searchSingleFiber(params: {
  startFiber: Fiber;
  nodeMatches: (node: Fiber) => boolean;
  maxDepth: number;
  visitedNodesRef: VisitedNodesRef;
}) {
  const { startFiber, nodeMatches, maxDepth, visitedNodesRef } = params;
  const queueNodes: (Fiber | null)[] = [startFiber];
  const queueDepths: number[] = [0];
  const queuePaths: ("child" | "sibling")[][] = [[]];
  let head = 0;

  while (head < queueNodes.length) {
    const node = queueNodes[head];
    const depth = queueDepths[head];
    const currentPath = queuePaths[head];
    head++;
    if (
      node == null ||
      depth == null ||
      currentPath == null ||
      depth > maxDepth
    )
      continue;

    visitedNodesRef.current++;

    if (nodeMatches(node)) {
      return { directions: currentPath };
    }

    const child = node.child;
    if (child != null) {
      queueNodes.push(child);
      queueDepths.push(depth + 1);
      queuePaths.push([...currentPath, "child"]);
    }
    const sibling = node.sibling;
    if (sibling != null) {
      queueNodes.push(sibling);
      queueDepths.push(depth);
      queuePaths.push([...currentPath, "sibling"]);
    }
  }

  return null;
}

export function findFiberNodes(
  condition: NameSearchCondition,
  options: NameSearchSingleOptions,
): Fiber | null;
export function findFiberNodes(
  condition: NameSearchCondition,
  options: NameSearchMultipleOptions,
): Fiber[];
export function findFiberNodes(
  condition: FunctionSearchCondition,
  options: SingleResultOptions,
): Fiber | null;
export function findFiberNodes(
  condition: FunctionSearchCondition,
  options: MultipleResultsOptions,
): Fiber[];

/**
 * Searches for React Fiber nodes in the component tree based on specified conditions.
 *
 * This function provides efficient searching through React's internal fiber tree structure.
 * It supports both single result (BFS) and multiple results (DFS) search modes with configurable
 * depth limits and performance profiling.
 *
 * **Note:** The function automatically starts traversal from the alternate (work-in-progress) fiber
 * tree when available, ensuring that all returned nodes contain the most up-to-date state during
 * React's reconciliation phase.
 *
 * **Caching:** By default, search results are cached based on the input arguments. Subsequent searches
 * with identical parameters will return cached results without traversing the tree. Cached entries are
 * automatically invalidated if the root element is no longer in the document. Use `cache: false` to
 * disable caching, or call `clearFiberSearchCache()` to clear the cache manually.
 *
 * @template T - Boolean flag indicating whether to find all matches or just the first one
 * @param condition - Search criteria specifying either a component name or custom predicate function
 * @param options - Configuration options including the required rootElementSelector. The `exact` option is only available when searching by name.
 * @returns When findAll is true, returns an array of matching Fiber nodes. Otherwise returns the first matching Fiber node or null.
 *
 * @example
 * // Find first component by name (case-insensitive substring match)
 * const node = findFiberNodes(
 *   { name: "MyComponent" },
 *   { rootElementSelector: "#root" }
 * );
 *
 * @example
 * // Find all components with exact name match
 * const nodes = findFiberNodes(
 *   { name: "LazyContainerFactory" },
 *   { rootElementSelector: "#root", exact: true, findAll: true }
 * );
 *
 * @example
 * // Find all components at the same depth level
 * const nodes = findFiberNodes(
 *   { name: "ListItem" },
 *   { rootElementSelector: "#root", findAll: true, expectSameDepth: true }
 * );
 *
 * @example
 * // Find using custom predicate function (exact option not available)
 * const node = findFiberNodes(
 *   { fn: (fiber) => fiber.memoizedProps?.value?.isCopilot != null },
 *   { rootElementSelector: "#root" }
 * );
 *
 * @example
 * // Combine name and function (OR semantics, exact option available)
 * const nodes = findFiberNodes(
 *   {
 *     name: "Button",
 *     fn: (fiber) => fiber.memoizedProps?.disabled === true
 *   },
 *   { rootElementSelector: "#root", exact: true, findAll: true, maxDepth: 10, profile: true }
 * );
 *
 * @example
 * // Disable caching for a specific search
 * const node = findFiberNodes(
 *   { name: "DynamicComponent" },
 *   { rootElementSelector: "#root", cache: false }
 * );
 */
export function findFiberNodes(
  condition: FiberSearchCondition,
  options: NameSearchOptions | BaseFiberSearchOptions,
): Fiber | Fiber[] | null {
  const exact = "exact" in options ? options.exact === true : false;
  const maxDepth = options.maxDepth ?? Infinity;
  const findAll = options.findAll === true;
  const expectSameDepth =
    "expectSameDepth" in options ? options.expectSameDepth === true : false;
  const cache = options.cache !== false;
  const profile = options.profile === true;

  let shouldReturnCached = false;
  let cachedPaths: FiberPath[] | null = null;

  const hasName = "name" in condition && typeof condition.name === "string";
  const hasFn = "fn" in condition && typeof condition.fn === "function";

  if (!hasName && !hasFn) {
    console.warn(
      "You must provide at least a name or a function as condition.",
    );
    return findAll ? [] : null;
  }

  const rootEl = document.querySelector(options.rootElementSelector);
  if (rootEl == null) {
    if (cache) {
      const cacheKey = generateCacheKey(condition, options);
      searchCache.delete(cacheKey);
    }
    console.warn(
      `No element found for selector: ${options.rootElementSelector}`,
    );
    return findAll ? [] : null;
  }

  const rootFiber = getFiberFromElement(rootEl);
  if (rootFiber == null) {
    if (cache) {
      const cacheKey = generateCacheKey(condition, options);
      searchCache.delete(cacheKey);
    }
    return findAll ? [] : null;
  }

  const startFiber = rootFiber.alternate ?? rootFiber;

  if (cache) {
    const cacheKey = generateCacheKey(condition, options);
    const cachedEntry = searchCache.get(cacheKey);
    if (cachedEntry !== undefined) {
      const isRootInDocument = document.body.contains(cachedEntry.rootElement);
      const isRootUnchanged = cachedEntry.rootElement === rootEl;

      if (isRootInDocument && isRootUnchanged) {
        cachedPaths = cachedEntry.paths;
        shouldReturnCached = true;
      } else {
        searchCache.delete(cacheKey);
        if (profile) {
          console.log("FiberSearch profile:", {
            mode: findAll ? "findAll" : "single",
            cached: false,
            cacheInvalidated: true,
            reason: !isRootInDocument
              ? "Root element no longer in document"
              : "Root element changed",
          });
        }
      }
    }
  }

  if (shouldReturnCached && cachedPaths !== null) {
    const results: Fiber[] = [];
    for (const path of cachedPaths) {
      const node = followPath(startFiber, path);
      if (node != null) {
        results.push(node);
      }
    }

    if (profile) {
      const pathStrings = cachedPaths.map((p) => pathToString(p));
      console.log("FiberSearch profile:", {
        mode: findAll ? "findAll" : "single",
        cached: true,
        cacheHit: true,
        pathsFollowed: cachedPaths.length,
        nodesFound: results.length,
      });
      pathStrings.forEach((path, i) => {
        console.log(`  [${i}]: ${path}`);
      });
    }

    return findAll ? results : (results[0] ?? null);
  } else if (shouldReturnCached && cachedPaths === null) {
    if (profile) {
      console.log("FiberSearch profile:", {
        mode: findAll ? "findAll" : "single",
        cached: true,
        cacheHit: true,
        result: null,
        path: null,
      });
    }
    return findAll ? [] : null;
  }

  const getComponentNameFromFiber = createComponentNameGetter();
  const nodeMatches = createNodeMatcher({
    condition,
    exact,
    hasName,
    hasFn,
    getComponentNameFromFiber,
  });

  const visitedNodesRef: VisitedNodesRef = { current: 0 };
  const startedAt = profile ? performance.now() : 0;

  if (findAll) {
    const resultPaths = searchAllFibers({
      startFiber,
      nodeMatches,
      maxDepth,
      expectSameDepth,
      visitedNodesRef,
    });

    const results: Fiber[] = [];
    for (const path of resultPaths) {
      const node = followPath(startFiber, path);
      if (node != null) {
        results.push(node);
      }
    }

    if (profile) {
      const duration = performance.now() - startedAt;
      console.log("FiberSearch profile:", {
        mode: "findAll",
        cached: false,
        cacheEnabled: cache,
        durationMs: Number(duration.toFixed(2)),
        visitedNodes: visitedNodesRef.current,
        matches: results.length,
      });

      resultPaths
        .map((p) => pathToString(p))
        .forEach((path, i) => {
          console.log(`  [${i}]: ${path}`);
        });
    }

    if (results.length === 0) {
      console.warn("No fiber node(s) found for provided condition.");
    }

    if (cache) {
      const cacheKey = generateCacheKey(condition, options);
      searchCache.set(cacheKey, {
        paths: resultPaths.length > 0 ? resultPaths : null,
        rootElement: rootEl,
      });
    }

    return results;
  }

  const resultPath = searchSingleFiber({
    startFiber,
    nodeMatches,
    maxDepth,
    visitedNodesRef,
  });

  const result = resultPath ? followPath(startFiber, resultPath) : null;

  if (profile) {
    const duration = performance.now() - startedAt;
    console.log("FiberSearch profile:", {
      mode: "single",
      cached: false,
      cacheEnabled: cache,
      durationMs: Number(duration.toFixed(2)),
      visitedNodes: visitedNodesRef.current,
      match: result ? getComponentNameFromFiber(result) : null,
      path: resultPath ? pathToString(resultPath) : null,
    });
  }

  if (result == null) {
    console.warn("No fiber node(s) found for provided condition.");
  }

  if (cache) {
    const cacheKey = generateCacheKey(condition, options);
    searchCache.set(cacheKey, {
      paths: resultPath ? [resultPath] : null,
      rootElement: rootEl,
    });
  }

  return result;
}

export function clearFiberSearchCache(): void {
  searchCache.clear();
}
