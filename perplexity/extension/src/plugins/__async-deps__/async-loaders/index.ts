import type { DependencyRegistry } from "@complexity/async-dep-registry";
import { AsyncDependencyRegistry } from "@complexity/async-dep-registry";

export interface AsyncLoadersRegistry extends DependencyRegistry {}

export const AsyncLoaderRegistry =
  AsyncDependencyRegistry.create<AsyncLoadersRegistry>({
    verbose: false,
    auto: true,
  });
