import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { AsyncDependencyRegistry } from "@/async-dep-registry";
import type { DependencyRegistry } from "@/async-dep-registry.types";

interface TestRegistry extends DependencyRegistry {
  testSimple: string;
  testWithDeps: number;
  testWithNestedDeps: boolean;
  testComplex: { value: string };
  testCircularA: string;
  testCircularB: string;
  testErrorDep: never;
  parallelDep1: number;
  parallelDep2: number;
  parallelDep3: number;
  parallelDepL1A: number;
  parallelDepL1B: number;
  parallelDepL2: number;
  testSyncSimple: string;
  testSyncWithDeps: number;
  testMixedSync: { value: string };
}

describe("AsyncDependencyRegistry", () => {
  let asyncDependencyRegistry: AsyncDependencyRegistry<TestRegistry>;

  beforeEach(() => {
    asyncDependencyRegistry = AsyncDependencyRegistry.create<TestRegistry>();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create multiple instances", () => {
    const manager1 = AsyncDependencyRegistry.create<TestRegistry>();
    const manager2 = AsyncDependencyRegistry.create<TestRegistry>();

    // Instances should be different objects
    expect(manager1).not.toBe(manager2);

    // Register a dependency in manager1
    manager1.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "value in manager1",
    });

    // Register a different dependency in manager2
    manager2.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "value in manager2",
    });

    // Changes in one manager should not affect the other
    return Promise.all([
      manager1
        .load("testSimple")
        .then((value) => expect(value).toBe("value in manager1")),
      manager2
        .load("testSimple")
        .then((value) => expect(value).toBe("value in manager2")),
    ]);
  });

  it("should register and load a simple dependency", async () => {
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    const result = await asyncDependencyRegistry.load("testSimple");
    expect(result).toBe("test value");
  });

  it("should handle dependencies correctly", async () => {
    asyncDependencyRegistry.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => {
        return deps.testSimple.length;
      },
    });

    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    const result = await asyncDependencyRegistry.load("testWithDeps");
    expect(result).toBe(10);
  });

  it("should handle nested dependencies", async () => {
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    asyncDependencyRegistry.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => deps.testSimple.length,
    });

    asyncDependencyRegistry.register({
      id: "testWithNestedDeps",
      dependencies: ["testWithDeps"],
      loader: async (deps) => deps.testWithDeps > 5,
    });

    const result = await asyncDependencyRegistry.load("testWithNestedDeps");
    expect(result).toBe(true);
  });

  it("should detect circular dependencies", async () => {
    asyncDependencyRegistry.register({
      id: "testCircularA",
      dependencies: ["testCircularB"],
      loader: async (deps) => `A depends on ${deps.testCircularB}`,
    });

    asyncDependencyRegistry.register({
      id: "testCircularB",
      dependencies: ["testCircularA"],
      loader: async (deps) => `B depends on ${deps.testCircularA}`,
    });

    await expect(asyncDependencyRegistry.load("testCircularA")).rejects.toThrow(
      /Circular dependency detected/,
    );
  });

  it("should handle loader errors", async () => {
    asyncDependencyRegistry.register({
      id: "testErrorDep",
      dependencies: [],
      loader: async () => {
        throw new Error("Test error");
      },
    });

    await expect(asyncDependencyRegistry.load("testErrorDep")).rejects.toThrow(
      "Test error",
    );
  });

  it("should load multiple dependencies", async () => {
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    asyncDependencyRegistry.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => deps.testSimple.length,
    });

    await asyncDependencyRegistry.loadMultiple(["testSimple", "testWithDeps"]);

    const simple = await asyncDependencyRegistry.load("testSimple");
    const withDeps = await asyncDependencyRegistry.load("testWithDeps");

    expect(simple).toBe("test value");
    expect(withDeps).toBe(10);
  });

  it("should handle complex dependency objects", async () => {
    asyncDependencyRegistry.register({
      id: "testComplex",
      dependencies: [],
      loader: async () => ({ value: "complex value" }),
    });

    const result = await asyncDependencyRegistry.load("testComplex");
    expect(result).toEqual({ value: "complex value" });
    expect(result.value).toBe("complex value");
  });

  it("should throw error on duplicate registrations", async () => {
    const manager = AsyncDependencyRegistry.create<TestRegistry>();

    manager.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "first value",
    });

    expect(() => {
      manager.register({
        id: "testSimple",
        dependencies: [],
        loader: async () => "second value",
      });
    }).toThrow(
      'Dependency with id "testSimple" is already registered. Cannot register the same dependency ID multiple times.',
    );
  });

  it("should handle loading non-existent dependencies", async () => {
    await expect(
      asyncDependencyRegistry.load(
        "nonExistent" as unknown as keyof DependencyRegistry,
      ),
    ).rejects.toThrow('Dependency "nonExistent" not registered');
  });

  it("should reset properly", async () => {
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    await asyncDependencyRegistry.load("testSimple");
    asyncDependencyRegistry.reset();

    await expect(asyncDependencyRegistry.load("testSimple")).rejects.toThrow(
      'Dependency "testSimple" not registered',
    );
  });

  it("should load all dependencies in correct order with loadAll", async () => {
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    asyncDependencyRegistry.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => deps.testSimple.length,
    });

    asyncDependencyRegistry.register({
      id: "testWithNestedDeps",
      dependencies: ["testWithDeps"],
      loader: async (deps) => deps.testWithDeps > 5,
    });

    asyncDependencyRegistry.register({
      id: "testComplex",
      dependencies: ["testSimple", "testWithDeps"],
      loader: async (deps) => ({
        value: `${deps.testSimple}-${deps.testWithDeps}`,
      }),
    });

    const result = await asyncDependencyRegistry.loadAll();

    // Type assertions
    expect(typeof result.testSimple).toBe("string");
    expect(typeof result.testWithDeps).toBe("number");
    expect(typeof result.testWithNestedDeps).toBe("boolean");
    expect(typeof result.testComplex).toBe("object");
    expect(typeof (result.testComplex as { value: string }).value).toBe(
      "string",
    );

    expect(result.testSimple).toBe("test value");
    expect(result.testWithDeps).toBe(10);
    expect(result.testWithNestedDeps).toBe(true);
    expect(result.testComplex).toEqual({ value: "test value-10" });
  });

  it("should detect circular dependencies in loadAll", async () => {
    asyncDependencyRegistry.register({
      id: "testCircularA",
      dependencies: ["testCircularB"],
      loader: async (deps) => `A depends on ${deps.testCircularB}`,
    });

    asyncDependencyRegistry.register({
      id: "testCircularB",
      dependencies: ["testCircularA"],
      loader: async (deps) => `B depends on ${deps.testCircularA}`,
    });

    await expect(asyncDependencyRegistry.loadAll()).rejects.toThrow(
      /Circular dependency detected/,
    );
  });

  it("should handle missing dependency registrations", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    asyncDependencyRegistry.setVerbose(true);

    vi.clearAllMocks();

    asyncDependencyRegistry.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => deps.testSimple.length,
    });

    const loadPromise = asyncDependencyRegistry.load("testWithDeps");

    let resolved = false;
    void loadPromise.then(() => {
      resolved = true;
    });

    expect(console.warn).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(5100);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '5 seconds have passed, but load operation for "testWithDeps" is still hanging because dependencies are not registered: testSimple',
      ),
    );

    expect(resolved).toBe(false);

    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "test value",
    });

    await vi.advanceTimersByTimeAsync(100);

    const result = await loadPromise;

    expect(result).toBe(10);
    expect(resolved).toBe(true);

    vi.useRealTimers();
  });

  it("should load dependencies with no prerequisites in parallel", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const timings: number[] = [];
    const delays = [100, 150, 50] as const; // ms

    asyncDependencyRegistry.register({
      id: "parallelDep1",
      dependencies: [],
      loader: async () => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, delays[0]));
        const timing = Date.now() - startTime;
        timings.push(timing);
        return delays[0];
      },
    });

    asyncDependencyRegistry.register({
      id: "parallelDep2",
      dependencies: [],
      loader: async () => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, delays[1]));
        const timing = Date.now() - startTime;
        timings.push(timing);
        return delays[1];
      },
    });

    asyncDependencyRegistry.register({
      id: "parallelDep3",
      dependencies: [],
      loader: async () => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, delays[2]));
        const timing = Date.now() - startTime;
        timings.push(timing);
        return delays[2];
      },
    });

    const loadPromise = asyncDependencyRegistry.loadAll();
    await vi.runAllTimersAsync();
    const result = await loadPromise;

    expect(timings.length).toBe(3);
    expect(result.parallelDep1).toBe(delays[0]);
    expect(result.parallelDep2).toBe(delays[1]);
    expect(result.parallelDep3).toBe(delays[2]);

    vi.useRealTimers();
  });

  it("should load dependencies at the same level in parallel", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const level0Delay = 50; // ms
    const level1Delays = [100, 150] as const; // ms
    const level2Delay = 80; // ms
    const timingsByLevel: [number[], number[], number[]] = [[], [], []];

    // Level 0 (root)
    asyncDependencyRegistry.register({
      id: "parallelDep1",
      dependencies: [],
      loader: async () => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, level0Delay));
        const timing = Date.now() - startTime;
        timingsByLevel[0].push(timing);
        return level0Delay;
      },
    });

    // Level 1 (parallel execution)
    asyncDependencyRegistry.register({
      id: "parallelDepL1A",
      dependencies: ["parallelDep1"],
      loader: async (_deps) => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, level1Delays[0]));
        const timing = Date.now() - startTime;
        timingsByLevel[1].push(timing);
        return level1Delays[0];
      },
    });

    asyncDependencyRegistry.register({
      id: "parallelDepL1B",
      dependencies: ["parallelDep1"],
      loader: async (_deps) => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, level1Delays[1]));
        const timing = Date.now() - startTime;
        timingsByLevel[1].push(timing);
        return level1Delays[1];
      },
    });

    // Level 2 (depends on both level 1)
    asyncDependencyRegistry.register({
      id: "parallelDepL2",
      dependencies: ["parallelDepL1A", "parallelDepL1B"],
      loader: async () => {
        const startTime = Date.now();
        await new Promise((resolve) => setTimeout(resolve, level2Delay));
        const timing = Date.now() - startTime;
        timingsByLevel[2].push(timing);
        return level2Delay;
      },
    });

    const loadPromise = asyncDependencyRegistry.loadAll();
    await vi.runAllTimersAsync();
    const result = await loadPromise;

    expect(timingsByLevel[0].length).toBe(1);
    expect(timingsByLevel[1].length).toBe(2);
    expect(timingsByLevel[2].length).toBe(1);

    expect(result.parallelDep1).toBe(level0Delay);
    expect(result.parallelDepL1A).toBe(level1Delays[0]);
    expect(result.parallelDepL1B).toBe(level1Delays[1]);
    expect(result.parallelDepL2).toBe(level2Delay);

    vi.useRealTimers();
  });

  it("should register and load a dependency with synchronous loader", async () => {
    asyncDependencyRegistry.register({
      id: "testSyncSimple",
      dependencies: [],
      loader: () => "sync test value",
    });

    const result = await asyncDependencyRegistry.load("testSyncSimple");
    expect(result).toBe("sync test value");
  });

  it("should handle dependencies with synchronous loaders correctly", async () => {
    asyncDependencyRegistry.register({
      id: "testSyncSimple",
      dependencies: [],
      loader: () => "sync test value",
    });

    asyncDependencyRegistry.register({
      id: "testSyncWithDeps",
      dependencies: ["testSyncSimple"],
      loader: (deps) => {
        return deps.testSyncSimple.length;
      },
    });

    const result = await asyncDependencyRegistry.load("testSyncWithDeps");
    expect(result).toBe(15);
  });

  it("should mix synchronous and asynchronous loaders", async () => {
    // Synchronous dependency
    asyncDependencyRegistry.register({
      id: "testSyncSimple",
      dependencies: [],
      loader: () => "sync value",
    });

    // Asynchronous dependency
    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "async value",
    });

    // Mixed dependency that depends on both
    asyncDependencyRegistry.register({
      id: "testMixedSync",
      dependencies: ["testSyncSimple", "testSimple"],
      loader: (deps) => ({
        value: `${deps.testSyncSimple}-${deps.testSimple}`,
      }),
    });

    const result = await asyncDependencyRegistry.load("testMixedSync");
    expect(result).toEqual({ value: "sync value-async value" });
  });

  it("should load all dependencies with synchronous loaders in loadAll", async () => {
    asyncDependencyRegistry.register({
      id: "testSyncSimple",
      dependencies: [],
      loader: () => "sync value",
    });

    asyncDependencyRegistry.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "async value",
    });

    asyncDependencyRegistry.register({
      id: "testMixedSync",
      dependencies: ["testSyncSimple", "testSimple"],
      loader: (deps) => ({
        value: `${deps.testSyncSimple}-${deps.testSimple}`,
      }),
    });

    const result = await asyncDependencyRegistry.loadAll();

    expect(result.testSyncSimple).toBe("sync value");
    expect(result.testSimple).toBe("async value");
    expect(result.testMixedSync).toEqual({ value: "sync value-async value" });
  });

  it("should always log errors regardless of verbose setting", async () => {
    // Create with verbose=false
    const silentManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: false,
    });

    vi.clearAllMocks();

    silentManager.register({
      id: "testErrorDep",
      dependencies: [],
      loader: async () => {
        throw new Error("Test error");
      },
    });

    await expect(silentManager.load("testErrorDep")).rejects.toThrow(
      "Test error",
    );

    // Error should be logged even when verbose is false
    expect(console.error).toHaveBeenCalled();

    // Info and warn should not be called
    expect(console.info).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("should toggle verbose setting", async () => {
    // Create with verbose=false initially
    const manager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: false,
    });

    vi.clearAllMocks();

    // Register dependencies when verbose is false (should not log info messages)
    manager.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => "first",
    });

    manager.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async ({ testSimple }) => testSimple.length,
    });

    await manager.load("testWithDeps");

    // Should not log state transition info when verbose is false
    expect(console.info).not.toHaveBeenCalled();

    // Change to verbose mode
    manager.setVerbose(true);

    // Clear mocks to start fresh
    vi.clearAllMocks();

    // Register and load new dependencies (should log info messages now)
    manager.register({
      id: "testComplex",
      dependencies: [],
      loader: async () => ({ value: "verbose test" }),
    });

    await manager.load("testComplex");

    // Should log state transition info when verbose is true
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('Dependency "testComplex" state changed to:'),
    );
  });

  it("should log state transitions and timing when verbose is enabled", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // Create with verbose=true to ensure all messages are logged
    const verboseManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: true,
    });

    vi.clearAllMocks();

    const DELAY = 50; // ms

    // Register a dependency
    verboseManager.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        return "test value";
      },
    });

    // Verify registration logs
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'Dependency "testSimple" state changed to: pending',
      ),
    );

    vi.clearAllMocks();

    // Load the dependency
    const loadPromise = verboseManager.load("testSimple");

    // Verify loading state log
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'Dependency "testSimple" state changed to: loading',
      ),
    );

    vi.clearAllMocks();

    // Advance time to complete loading
    await vi.advanceTimersByTimeAsync(DELAY + 10);
    await loadPromise;

    // Verify loaded state log and timing information
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'Dependency "testSimple" state changed to: loaded',
      ),
    );
    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/Dependency "testSimple" loaded in \d+ms/),
    );

    vi.useRealTimers();
  });

  it("should only log errors when verbose is disabled", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // Create with verbose=false
    const quietManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: false,
    });

    vi.clearAllMocks();

    const DELAY = 50; // ms

    // Register a dependency
    quietManager.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => {
        await new Promise((resolve) => setTimeout(resolve, DELAY));
        return "test value";
      },
    });

    // No logs for registration in non-verbose mode
    expect(console.info).not.toHaveBeenCalled();

    // Load the dependency
    const loadPromise = quietManager.load("testSimple");

    // No logs for loading state in non-verbose mode
    expect(console.info).not.toHaveBeenCalled();

    // Advance time to complete loading
    await vi.advanceTimersByTimeAsync(DELAY + 10);
    await loadPromise;

    // No logs for loaded state in non-verbose mode
    expect(console.info).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("should log error state in both verbose and non-verbose modes", async () => {
    // Test with verbose=true
    const verboseManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: true,
    });

    verboseManager.register({
      id: "testErrorDep",
      dependencies: [],
      loader: async () => {
        throw new Error("Test error");
      },
    });

    vi.clearAllMocks();

    await expect(verboseManager.load("testErrorDep")).rejects.toThrow(
      "Test error",
    );

    // Verbose mode should log state changes
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'Dependency "testErrorDep" state changed to: loading',
      ),
    );
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining(
        'Dependency "testErrorDep" state changed to: error',
      ),
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error loading dependency "testErrorDep"'),
      expect.any(Error),
    );

    // Test with verbose=false
    const quietManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: false,
    });

    quietManager.register({
      id: "testErrorDep",
      dependencies: [],
      loader: async () => {
        throw new Error("Test error");
      },
    });

    vi.clearAllMocks();

    await expect(quietManager.load("testErrorDep")).rejects.toThrow(
      "Test error",
    );

    // Non-verbose mode should not log state changes but should log errors
    expect(console.info).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error loading dependency "testErrorDep"'),
      expect.any(Error),
    );
  });

  it("should log timing information for dependencies with multiple stages", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // Create with verbose=true
    const verboseManager = AsyncDependencyRegistry.create<TestRegistry>({
      verbose: true,
    });

    vi.clearAllMocks();

    // Register dependencies in order
    verboseManager.register({
      id: "testSimple",
      dependencies: [],
      loader: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "test value";
      },
    });

    verboseManager.register({
      id: "testWithDeps",
      dependencies: ["testSimple"],
      loader: async (deps) => {
        await new Promise((resolve) => setTimeout(resolve, 70));
        return deps.testSimple.length;
      },
    });

    vi.clearAllMocks();

    // Load testWithDeps which requires testSimple
    const loadPromise = verboseManager.load("testWithDeps");

    // Advance time for testSimple to load (50ms) + testWithDeps (70ms)
    await vi.advanceTimersByTimeAsync(150);
    await loadPromise;

    // Should log timing for both dependencies
    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/Dependency "testSimple" loaded in \d+ms/),
    );
    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/Dependency "testWithDeps" loaded in \d+ms/),
    );

    vi.useRealTimers();
  });
});
