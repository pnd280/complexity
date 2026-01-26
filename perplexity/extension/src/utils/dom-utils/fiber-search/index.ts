import {
  clearCache,
  deleteCacheEntry,
  followPath,
  generateCacheKey,
  getCacheEntry,
  pathToString,
  setCacheEntry,
} from "@/utils/dom-utils/fiber-search/cache";
import {
  createComponentNameGetter,
  createNodeMatcher,
  getFiberFromElement,
} from "@/utils/dom-utils/fiber-search/helpers";
import {
  searchAllFibers,
  searchAllFibersUpward,
  searchAllFibersWithUpward,
  searchSingleFiber,
  searchSingleFiberUpward,
  searchSingleFiberWithUpward,
} from "@/utils/dom-utils/fiber-search/traversal";
import type {
  BaseFiberSearchOptions,
  Fiber,
  FiberPath,
  FiberSearchCondition,
  FunctionSearchCondition,
  MultipleResultsOptions,
  NameSearchCondition,
  NameSearchMultipleOptions,
  NameSearchOptions,
  NameSearchSingleOptions,
  SingleResultOptions,
  VisitedNodesRef,
} from "@/utils/dom-utils/fiber-search/types";

export type {
  Fiber,
  FiberSearchCondition,
  FunctionSearchCondition,
  MultipleResultsOptions,
  NameSearchCondition,
  NameSearchMultipleOptions,
  NameSearchSingleOptions,
  SingleResultOptions,
} from "@/utils/dom-utils/fiber-search/types";

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
 * @param condition - Search criteria specifying either a component name or custom predicate function
 * @param options - Configuration options including the required rootElementSelector
 * @returns When findAll is true, returns an array of matching Fiber nodes. Otherwise returns the first matching Fiber node or null.
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
  const traverseDirection = options.traverseDirection ?? "down";

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
      deleteCacheEntry(cacheKey);
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
      deleteCacheEntry(cacheKey);
    }
    return findAll ? [] : null;
  }

  const startFiber = rootFiber.alternate ?? rootFiber;

  if (cache) {
    const cacheKey = generateCacheKey(condition, options);
    const cachedEntry = getCacheEntry(cacheKey);
    if (cachedEntry !== undefined) {
      const isRootInDocument = document.body.contains(cachedEntry.rootElement);
      const isRootUnchanged = cachedEntry.rootElement === rootEl;

      if (isRootInDocument && isRootUnchanged) {
        cachedPaths = cachedEntry.paths;
        shouldReturnCached = true;
      } else {
        deleteCacheEntry(cacheKey);
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
    const resultPaths =
      traverseDirection === "up"
        ? searchAllFibersUpward({
            startFiber,
            nodeMatches,
            maxDepth,
            expectSameDepth,
            visitedNodesRef,
          })
        : traverseDirection === "both"
          ? searchAllFibersWithUpward({
              startFiber,
              nodeMatches,
              maxDepth,
              expectSameDepth,
              visitedNodesRef,
            })
          : searchAllFibers({
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
        traverseDirection,
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
      setCacheEntry(cacheKey, {
        paths: resultPaths.length > 0 ? resultPaths : null,
        rootElement: rootEl,
      });
    }

    return results;
  }

  const resultPath =
    traverseDirection === "up"
      ? searchSingleFiberUpward({
          startFiber,
          nodeMatches,
          maxDepth,
          visitedNodesRef,
        })
      : traverseDirection === "both"
        ? searchSingleFiberWithUpward({
            startFiber,
            nodeMatches,
            maxDepth,
            visitedNodesRef,
          })
        : searchSingleFiber({
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
      traverseDirection,
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
    setCacheEntry(cacheKey, {
      paths: resultPath ? [resultPath] : null,
      rootElement: rootEl,
    });
  }

  return result;
}

export function clearFiberSearchCache(): void {
  clearCache();
}
