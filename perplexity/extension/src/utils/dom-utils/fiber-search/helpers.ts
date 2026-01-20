import type {
  Fiber,
  FiberSearchCondition,
} from "@/utils/dom-utils/fiber-search/types";

type ElementWithFiberCache = Element & {
  _best_fk?: string;
  [key: string]: unknown;
};

export function getFiberFromElement(element: Element): Fiber | null {
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

export function createComponentNameGetter() {
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

export function createNodeMatcher(params: {
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
