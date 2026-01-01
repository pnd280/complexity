import type {
  BaseFiberSearchOptions,
  Fiber,
  FiberPath,
  FiberSearchCondition,
  NameSearchOptions,
} from "@/utils/dom-utils/fiber-search/types";

type CacheKey = string;
type CacheValue = {
  paths: FiberPath[] | null;
  rootElement: Element;
};

const searchCache = new Map<CacheKey, CacheValue>();

export function followPath(root: Fiber, path: FiberPath): Fiber | null {
  let current: Fiber | null = root;
  for (const direction of path.directions) {
    if (current == null) return null;
    current = (current[direction] as Fiber | null | undefined) ?? null;
  }
  return current;
}

export function pathToString(path: FiberPath): string {
  return path.directions.join(".");
}

export function generateCacheKey(
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
    options.traverseDirection ?? "down",
  ].join("|");

  return `${conditionKey}::${optionsKey}`;
}

export function getCacheEntry(key: CacheKey): CacheValue | undefined {
  return searchCache.get(key);
}

export function setCacheEntry(key: CacheKey, value: CacheValue): void {
  searchCache.set(key, value);
}

export function deleteCacheEntry(key: CacheKey): void {
  searchCache.delete(key);
}

export function clearCache(): void {
  searchCache.clear();
}
