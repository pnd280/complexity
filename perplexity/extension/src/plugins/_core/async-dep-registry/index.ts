import type { DependencyRegistry } from "@complexity/async-dep-registry";
import { AsyncDependencyRegistry } from "@complexity/async-dep-registry";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AsyncLoadersRegistry extends DependencyRegistry {}

export const asyncLoaderRegistry =
  AsyncDependencyRegistry.create<AsyncLoadersRegistry>({
    verbose: false,
    auto: true,
  });
