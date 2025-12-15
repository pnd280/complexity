import type { MiddlewareData } from "@/entrypoints/contexts/content-scripts/core-plugins/network-intercept/listeners.types";
import type { MaybePromise } from "@/types/utils.types";

export type Middleware = {
  id: string;
  middlewareFn: <T extends MiddlewareData>(params: {
    data: T;
    stopPropagation: (data?: string) => never;
    skip: () => never;
    removeMiddleware: () => void;
  }) => MaybePromise<string>;
  priority?: MiddlewarePriority;
};

export type MiddlewarePriority =
  | MiddlewarePositionBasedPriority
  | MiddlewareNameBasedPriority;

export type MiddlewarePositionBasedPriority = {
  position: "first" | "last";
};

export type MiddlewareNameBasedPriority = {
  position: "beforeId" | "afterId";
  id: string;
};
