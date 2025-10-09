import { describe, expect, test } from "vitest";

import CorePluginsRegistry from "@/__registries__/core-plugins/index";

describe("CorePluginsRegistry", () => {
  test("should be defined", () => {
    expect(CorePluginsRegistry).toBeDefined();
  });

  test("should have manifest property", () => {
    expect(CorePluginsRegistry.manifest).toBeDefined();
    expect(typeof CorePluginsRegistry.manifest).toBe("object");
  });

  test("should have corePluginDependenciesCache property", () => {
    expect(CorePluginsRegistry.corePluginDependenciesCache).toBeDefined();
    expect(CorePluginsRegistry.corePluginDependenciesCache).toBeInstanceOf(Map);
  });

  test("should have getAllCorePluginDependencies method", () => {
    expect(CorePluginsRegistry.getAllCorePluginDependencies).toBeDefined();
    expect(typeof CorePluginsRegistry.getAllCorePluginDependencies).toBe(
      "function",
    );
  });

  test("should have register method", () => {
    expect(CorePluginsRegistry.register).toBeDefined();
    expect(typeof CorePluginsRegistry.register).toBe("function");
  });
});
