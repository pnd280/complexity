import type {
  Dependency,
  DependencyRegistry,
  DependencyState,
  DependencyParams,
} from "@/async-dep-registry.types";

/**
 * Options for configuring a AsyncDependencyRegistry instance
 */
type AsyncDependencyRegistryOptions = {
  /**
   * Whether to show all console messages (true) or only errors (false)
   * @default false
   */
  verbose?: boolean;
  /**
   * Whether to automatically load dependencies when they become ready
   * @default false
   */
  auto?: boolean;
};

export class AsyncDependencyRegistry<
  TRegistry extends DependencyRegistry = DependencyRegistry,
> {
  private dependencies: Map<
    keyof TRegistry,
    Dependency<keyof TRegistry, TRegistry>
  > = new Map();
  private dependencyStates: Map<keyof TRegistry, DependencyState> = new Map();
  private dependencyValues: Map<keyof TRegistry, unknown> = new Map();
  private pendingDependencies: Map<keyof TRegistry, Set<keyof TRegistry>> =
    new Map();
  private loadingPromises: Map<keyof TRegistry, Promise<unknown>> = new Map();
  private verbose: boolean = false;
  private auto: boolean = false;
  private registrationTimestamps: Map<keyof TRegistry, number> = new Map();
  private firstRegistrationTimestamp: number | null = null;
  private stateTransitionTimestamps: Map<
    keyof TRegistry,
    Record<DependencyState, number>
  > = new Map();
  private _pendingWarnings: Map<keyof TRegistry, NodeJS.Timeout> = new Map();
  private _pendingResolvers: Map<keyof TRegistry, Set<() => Promise<void>>> =
    new Map();

  constructor(options: AsyncDependencyRegistryOptions = {}) {
    this.verbose = options.verbose ?? false;
    this.auto = options.auto ?? false;
  }

  /**
   * Create a new instance of the AsyncDependencyRegistry.
   * @param options Configuration options for the dependency manager
   */
  static create<T extends DependencyRegistry>(
    options: AsyncDependencyRegistryOptions = {},
  ): AsyncDependencyRegistry<T> {
    return new AsyncDependencyRegistry<T>(options);
  }

  /**
   * Set the verbose mode of this instance
   * @param verbose Whether to show all console messages (true) or only errors (false)
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Set the auto mode of this instance
   * @param auto Whether to automatically load dependencies when they become ready
   */
  setAuto(auto: boolean): void {
    this.auto = auto;
    if (auto) {
      // If turning on auto mode, try to load all pending dependencies
      this.processAutoLoad();
    }
  }

  /**
   * Register a dependency with the dependency manager
   * @param options The dependency options
   */
  register<
    K extends keyof TRegistry,
    D extends readonly (keyof TRegistry)[],
  >(options: {
    id: K;
    dependencies: [...D];
    loader: (
      deps: DependencyParams<D, TRegistry>,
    ) => TRegistry[K] | Promise<TRegistry[K]>;
  }): void {
    const now = Date.now();

    // Update first registration timestamp if this is the first dependency
    if (this.firstRegistrationTimestamp === null) {
      this.firstRegistrationTimestamp = now;
    }

    // Check if dependency is already registered
    if (this.dependencies.has(options.id)) {
      throw new Error(
        `Dependency with id "${String(options.id)}" is already registered. Cannot register the same dependency ID multiple times.`,
      );
    }

    this.registrationTimestamps.set(options.id, now);
    this.stateTransitionTimestamps.set(
      options.id,
      {} as Record<DependencyState, number>,
    );

    // Cast to the internal Dependency type
    const dependency = options as unknown as Dependency<
      keyof TRegistry,
      TRegistry
    >;
    this.dependencies.set(options.id, dependency);

    const missingDependencies = this.findMissingDependencies(dependency);

    if (missingDependencies.length === 0) {
      this.updateDependencyState(options.id, "pending");
    } else {
      this.updateDependencyState(options.id, "inactive");
      this.pendingDependencies.set(options.id, new Set(missingDependencies));

      if (this.verbose) {
        console.info(
          `Dependency "${String(
            options.id,
          )}" is inactive because it's waiting for: ${missingDependencies
            .map(String)
            .join(", ")}`,
        );
      }
    }

    this.checkPendingDependencies(options.id);
  }

  private updateDependencyState(
    id: keyof TRegistry,
    state: DependencyState,
  ): void {
    const now = Date.now();
    const stateTimestamps = this.stateTransitionTimestamps.get(id);
    const previousState = this.dependencyStates.get(id);

    if (stateTimestamps) {
      stateTimestamps[state] = now;
    }

    if (previousState === "inactive" && state !== "inactive") {
      const warningTimeoutId = this._pendingWarnings.get(id);
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
        this._pendingWarnings.delete(id);
      }
    }

    this.dependencyStates.set(id, state);

    if (this.verbose) {
      console.info(`Dependency "${String(id)}" state changed to: ${state}`);

      if (state === "loaded") {
        const registrationTime = this.registrationTimestamps.get(id);
        const loadingStartTime = stateTimestamps?.loading;

        if (registrationTime != null) {
          const totalLoadTime = now - registrationTime;
          const actualLoadTime =
            loadingStartTime != null ? now - loadingStartTime : totalLoadTime;
          const idleTime = totalLoadTime - actualLoadTime;

          let colorCode = "\x1b[32m"; // Green (default)

          if (actualLoadTime > 100) {
            colorCode = "\x1b[31m"; // Red
          } else if (actualLoadTime > 50) {
            colorCode = "\x1b[33m"; // Orange (using yellow)
          } else if (actualLoadTime > 10) {
            colorCode = "\x1b[33m"; // Yellow
          }

          console.info(
            `${colorCode}Dependency "${String(id)}" loaded in ${actualLoadTime}ms (+${idleTime}ms idle)\x1b[0m`,
          );
        }
      }
    }

    // If auto mode is enabled and a dependency changed state or was loaded,
    // trigger auto loading of other dependencies
    if (this.auto && (state === "pending" || state === "loaded")) {
      this.processAutoLoad();
    }
  }

  private findMissingDependencies<K extends keyof TRegistry>(
    dependency: Dependency<K, TRegistry>,
  ): Array<keyof TRegistry> {
    return dependency.dependencies.filter(
      (depId) => !this.dependencies.has(depId),
    );
  }

  private checkPendingDependencies(newlyRegisteredId: keyof TRegistry): void {
    for (const [id, missingDeps] of this.pendingDependencies.entries()) {
      if (missingDeps.has(newlyRegisteredId)) {
        missingDeps.delete(newlyRegisteredId);

        if (missingDeps.size === 0) {
          this.updateDependencyState(id, "pending");
          this.pendingDependencies.delete(id);

          // Resolve any pending promises for this dependency now that it's ready
          const resolvers = this._pendingResolvers.get(id);
          if (resolvers && resolvers.size > 0) {
            if (this.verbose) {
              console.info(
                `Resolving ${resolvers.size} pending promises for "${String(id)}" now that dependencies are registered.`,
              );
            }

            // Call all resolvers
            for (const resolver of resolvers) {
              void resolver(); // void to ignore the promise
            }

            // Clear the resolvers
            resolvers.clear();
          }

          if (this.verbose) {
            console.info(
              `Dependency "${String(
                id,
              )}" is now pending (all dependencies registered).`,
            );
          }
        }
      }
    }

    // If auto mode is enabled and a new dependency was registered,
    // trigger auto loading
    if (this.auto) {
      this.processAutoLoad();
    }
  }

  async load<K extends keyof TRegistry>(id: K): Promise<TRegistry[K]> {
    const loadingPath = new Set<keyof TRegistry>();
    return this.resolveDependency(id, loadingPath);
  }

  private async resolveDependency<K extends keyof TRegistry>(
    id: K,
    loadingPath: Set<keyof TRegistry>,
  ): Promise<TRegistry[K]> {
    const state = this.dependencyStates.get(id);
    const dependency = this.dependencies.get(id);

    if (!dependency) {
      throw new Error(`Dependency "${String(id)}" not registered.`);
    }

    if (state === "inactive") {
      const missingDeps = this.pendingDependencies.get(id);
      const missingDepsList = missingDeps
        ? Array.from(missingDeps).map(String).join(", ")
        : "unknown dependencies";

      const warningTimeoutId = setTimeout(() => {
        if (this.dependencyStates.get(id) === "inactive") {
          console.warn(
            `5 seconds have passed, but load operation for "${String(id)}" is still hanging because dependencies are not registered: ${missingDepsList}. The promise will hang indefinitely until these dependencies are registered.`,
          );
        }
      }, 5000);

      this._pendingWarnings.set(id, warningTimeoutId);

      return new Promise<TRegistry[K]>((resolve) => {
        if (this._pendingResolvers == null) {
          this._pendingResolvers = new Map();
        }

        if (!this._pendingResolvers.has(id)) {
          this._pendingResolvers.set(id, new Set());
        }

        this._pendingResolvers.get(id)?.add(async () => {
          const value = await this.load(id);
          resolve(value);
        });
      });
    }

    if (loadingPath.has(id)) {
      const cyclePath = [...loadingPath, id].map(String).join(" -> ");
      throw new Error(`Circular dependency detected: ${cyclePath}`);
    }

    if (state === "loaded") {
      return this.dependencyValues.get(id) as TRegistry[K];
    }

    if (state === "error") {
      throw new Error(`Dependency "${String(id)}" previously failed to load.`);
    }

    if (state === "loading" && this.loadingPromises.has(id)) {
      try {
        const value = await this.loadingPromises.get(id);
        return value as TRegistry[K];
      } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
      }
    }

    this.updateDependencyState(id, "loading");
    loadingPath.add(id);

    const loadPromise = (async () => {
      try {
        const prerequisiteValues: Record<keyof TRegistry, unknown> =
          {} as Record<keyof TRegistry, unknown>;

        for (const depId of dependency.dependencies) {
          const resolvedValue = await this.resolveDependency(
            depId as keyof TRegistry,
            loadingPath,
          );

          prerequisiteValues[depId] = resolvedValue;
        }

        // Handle both synchronous and asynchronous loaders
        const loaderResult = dependency.loader(prerequisiteValues);
        const loadedValue =
          loaderResult instanceof Promise ? await loaderResult : loaderResult;

        this.dependencyValues.set(id, loadedValue);
        this.updateDependencyState(id, "loaded");

        this.loadingPromises.delete(id);
        loadingPath.delete(id);

        return loadedValue;
      } catch (error) {
        this.updateDependencyState(id, "error");
        this.loadingPromises.delete(id);
        loadingPath.delete(id);
        console.error(`Error loading dependency "${String(id)}":`, error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    })();

    this.loadingPromises.set(id, loadPromise);

    return loadPromise as Promise<TRegistry[K]>;
  }

  async loadMultiple(ids: Array<keyof TRegistry>): Promise<void> {
    await Promise.all(ids.map((id) => this.load(id)));
  }

  reset(): void {
    for (const timeoutId of this._pendingWarnings.values()) {
      clearTimeout(timeoutId);
    }

    this.dependencies.clear();
    this.dependencyStates.clear();
    this.dependencyValues.clear();
    this.pendingDependencies.clear();
    this.loadingPromises.clear();
    this.registrationTimestamps.clear();
    this.stateTransitionTimestamps.clear();
    this._pendingWarnings.clear();
    this._pendingResolvers.clear();
  }

  /**
   * Generate and print a summary report of dependency loading performance
   */
  summary(): void {
    const report: Array<{
      id: string;
      state: DependencyState;
      actualLoadTime: number | null;
      idleTime: number | null;
      totalLoadTime: number | null;
      registrationDelay: number | null;
    }> = [];

    for (const [id, state] of this.dependencyStates.entries()) {
      const registrationTime = this.registrationTimestamps.get(id);
      const timestamps = this.stateTransitionTimestamps.get(id);

      let actualLoadTime: number | null = null;
      let idleTime: number | null = null;
      let totalLoadTime: number | null = null;
      let registrationDelay: number | null = null;

      if (registrationTime != null && this.firstRegistrationTimestamp != null) {
        registrationDelay = registrationTime - this.firstRegistrationTimestamp;
      }

      if (state === "loaded" && registrationTime != null && timestamps) {
        const loadedTime = timestamps.loaded;
        const loadingTime = timestamps.loading;

        if (loadedTime) {
          totalLoadTime = loadedTime - registrationTime;

          if (loadingTime) {
            actualLoadTime = loadedTime - loadingTime;
            idleTime = totalLoadTime - actualLoadTime;
          }
        }
      }

      report.push({
        id: String(id),
        state,
        actualLoadTime,
        idleTime,
        totalLoadTime,
        registrationDelay,
      });
    }

    // Sort by total load time (descending)
    report.sort((a, b) => {
      return (b.totalLoadTime ?? 0) - (a.totalLoadTime ?? 0);
    });

    console.table(report);
  }

  /**
   * Process all pending dependencies when auto mode is enabled
   */
  private processAutoLoad(): void {
    if (!this.auto) return;

    const pendingDeps: Array<keyof TRegistry> = [];

    // Find all dependencies in pending state
    for (const [id, state] of this.dependencyStates.entries()) {
      if (state === "pending") {
        pendingDeps.push(id);
      }
    }

    if (pendingDeps.length > 0) {
      // Load them in parallel
      void Promise.all(
        pendingDeps.map((id) => {
          // Only start loading if not already loading
          if (!this.loadingPromises.has(id)) {
            return this.load(id).catch((err) => {
              if (this.verbose) {
                console.error(`Auto-loading of "${String(id)}" failed:`, err);
              }
            });
          }
          return Promise.resolve();
        }),
      );
    }
  }

  async loadAll(): Promise<
    Record<keyof TRegistry, TRegistry[keyof TRegistry]>
  > {
    const dependencyGraph = new Map<keyof TRegistry, Set<keyof TRegistry>>();
    const result: Record<keyof TRegistry, TRegistry[keyof TRegistry]> =
      {} as Record<keyof TRegistry, TRegistry[keyof TRegistry]>;

    for (const [id, dependency] of this.dependencies.entries()) {
      dependencyGraph.set(id, new Set(dependency.dependencies));
    }

    while (dependencyGraph.size > 0) {
      const currentLevel: Array<keyof TRegistry> = [];
      for (const [id, deps] of dependencyGraph.entries()) {
        if (deps.size === 0) {
          currentLevel.push(id);
        }
      }

      if (currentLevel.length === 0 && dependencyGraph.size > 0) {
        const cyclePath = this.findCyclePath(dependencyGraph);

        const unresolvedInfo = Array.from(dependencyGraph.entries())
          .map(
            ([id, deps]) =>
              `${String(id)} (depends on: ${Array.from(deps)
                .map(String)
                .join(", ")})`,
          )
          .join("; ");

        if (cyclePath) {
          throw new Error(
            `Circular dependency detected: ${cyclePath}. Unresolved dependencies: ${unresolvedInfo}`,
          );
        } else {
          throw new Error(
            `Could not resolve all dependencies. Unresolved: ${unresolvedInfo}`,
          );
        }
      }

      try {
        const loadResults = await Promise.all(
          currentLevel.map(async (id) => {
            try {
              const value = await this.load(id);
              return { id, value, success: true as const };
            } catch (error) {
              return { id, error, success: false as const };
            }
          }),
        );

        const failures = loadResults.filter((result) => !result.success);
        if (failures.length > 0) {
          const firstFailure = failures[0]!;
          throw new Error(
            `Failed to load dependency "${String(firstFailure.id)}": ${
              firstFailure.error instanceof Error
                ? firstFailure.error.message
                : String(firstFailure.error)
            }`,
          );
        }

        for (const { id, value } of loadResults) {
          result[id] = value as TRegistry[typeof id];
          dependencyGraph.delete(id);
        }

        for (const [_id, deps] of dependencyGraph.entries()) {
          for (const loadedId of currentLevel) {
            deps.delete(loadedId);
          }
        }
      } catch (error) {
        console.error("Failed to load dependencies:", error);
        throw error;
      }
    }

    return result;
  }

  private findCyclePath(
    graph: Map<keyof TRegistry, Set<keyof TRegistry>>,
  ): string | null {
    for (const startId of graph.keys()) {
      const visited = new Set<keyof TRegistry>();
      const path: Array<keyof TRegistry> = [];

      if (this.dfsDetectCycle(graph, startId, visited, path)) {
        const lastNode = path[path.length - 1];
        if (lastNode !== undefined) {
          const cycleStart = path.indexOf(lastNode);
          const cycle = path.slice(cycleStart);
          return cycle.map(String).join(" -> ");
        }
      }
    }

    return null;
  }

  private dfsDetectCycle(
    graph: Map<keyof TRegistry, Set<keyof TRegistry>>,
    current: keyof TRegistry,
    visited: Set<keyof TRegistry>,
    path: Array<keyof TRegistry>,
  ): boolean {
    if (path.includes(current)) {
      path.push(current);
      return true;
    }

    if (visited.has(current)) {
      return false;
    }

    visited.add(current);
    path.push(current);

    const neighbors = graph.get(current);
    if (neighbors) {
      for (const neighbor of neighbors) {
        if (this.dfsDetectCycle(graph, neighbor, visited, path)) {
          return true;
        }
      }
    }

    path.pop();
    return false;
  }
}
