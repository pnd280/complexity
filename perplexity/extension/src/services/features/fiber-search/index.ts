import {
  clearFiberSearchCache,
  findFiberNodes,
  type FiberSearchCondition,
  type NameSearchCondition,
  type FunctionSearchCondition,
  type NameSearchSingleOptions,
  type NameSearchMultipleOptions,
  type SingleResultOptions,
  type MultipleResultsOptions,
  type Fiber,
} from "@/services/features/fiber-search/utils";

export default class FiberSearchService {
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
   * disable caching, or call `clearCache()` to clear the cache manually.
   *
   * @example
   * // Find first component by name (case-insensitive substring match)
   * const node = FiberSearchServiceImpl.findFiberNodes(
   *   { name: "MyComponent" },
   *   { rootElementSelector: "#root" }
   * );
   *
   * @example
   * // Find all components with exact name match
   * const nodes = FiberSearchServiceImpl.findFiberNodes(
   *   { name: "LazyContainerFactory" },
   *   { rootElementSelector: "#root", exact: true, findAll: true }
   * );
   *
   * @example
   * // Find all components at the same depth level
   * const nodes = FiberSearchServiceImpl.findFiberNodes(
   *   { name: "ListItem" },
   *   { rootElementSelector: "#root", findAll: true, expectSameDepth: true }
   * );
   *
   * @example
   * // Find using custom predicate function
   * const node = FiberSearchServiceImpl.findFiberNodes(
   *   { fn: (fiber) => fiber.memoizedProps?.value?.isCopilot != null },
   *   { rootElementSelector: "#root" }
   * );
   *
   * @example
   * // Combine name and function (OR semantics)
   * const nodes = FiberSearchServiceImpl.findFiberNodes(
   *   {
   *     name: "Button",
   *     fn: (fiber) => fiber.memoizedProps?.disabled === true
   *   },
   *   { rootElementSelector: "#root", exact: true, findAll: true, maxDepth: 10, profile: true }
   * );
   *
   * @example
   * // Search upward through parent nodes
   * const parentNode = FiberSearchServiceImpl.findFiberNodes(
   *   { name: "ParentComponent" },
   *   { rootElementSelector: "#child", traverseDirection: "up" }
   * );
   *
   * @example
   * // Search in both directions
   * const nodes = FiberSearchServiceImpl.findFiberNodes(
   *   { name: "SharedComponent" },
   *   { rootElementSelector: "#root", findAll: true, traverseDirection: "both" }
   * );
   */
  static findFiberNodes(
    condition: NameSearchCondition,
    options: NameSearchSingleOptions,
  ): Fiber | null;
  static findFiberNodes(
    condition: NameSearchCondition,
    options: NameSearchMultipleOptions,
  ): Fiber[];
  static findFiberNodes(
    condition: FunctionSearchCondition,
    options: SingleResultOptions,
  ): Fiber | null;
  static findFiberNodes(
    condition: FunctionSearchCondition,
    options: MultipleResultsOptions,
  ): Fiber[];
  static findFiberNodes(
    condition: FiberSearchCondition,
    options:
      | NameSearchSingleOptions
      | NameSearchMultipleOptions
      | SingleResultOptions
      | MultipleResultsOptions,
  ): Fiber | Fiber[] | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return findFiberNodes(condition as any, options as any);
  }

  /**
   * Clears the fiber search cache.
   * Use this when you need to force re-evaluation of search queries.
   */
  static clearCache(): void {
    clearFiberSearchCache();
  }
}
