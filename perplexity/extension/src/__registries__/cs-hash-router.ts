import type { RouteObject } from "react-router-dom";

export const hashRouterObservers: RouteObject[] = (() => {
  return Object.values(
    import.meta.glob("@/plugins/**/*.hash-router.{ts,tsx}", {
      eager: true,
    }) as Record<
      string,
      {
        default: RouteObject;
      }
    >,
  ).map((module) => {
    invariant(module.default != null, "[HashRouter] Invalid context");

    return module.default;
  });
})();
