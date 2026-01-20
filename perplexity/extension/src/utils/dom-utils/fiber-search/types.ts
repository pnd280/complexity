export type Fiber = {
  type: unknown;
  elementType?: unknown;
  child: Fiber | null;
  sibling: Fiber | null;
  alternate: Fiber | null;
  return?: Fiber | null;
  [key: string]: unknown;
};

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
  /**
   * Direction to traverse the fiber tree.
   * - "down": Traverse downward through children and siblings (default)
   * - "up": Traverse upward through parent nodes (via `.return`) and their siblings
   * - "both": Traverse in both directions
   * @default "down"
   */
  traverseDirection?: "up" | "down" | "both";
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

export type BaseFiberSearchOptions =
  | SingleResultOptions
  | MultipleResultsOptions;

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

export type NameSearchOptions =
  | NameSearchSingleOptions
  | NameSearchMultipleOptions;

export type FiberPath = {
  directions: ("child" | "sibling" | "return")[];
};

export type VisitedNodesRef = { current: number };
