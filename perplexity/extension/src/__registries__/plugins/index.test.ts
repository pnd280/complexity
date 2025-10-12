import { describe, expect, test } from "vitest";

import { PluginManifestsRegistry } from "@/__registries__/plugins/index";

describe("PluginManifestsRegistry", () => {
  test("should be defined", () => {
    expect(PluginManifestsRegistry).toBeDefined();
  });

  test("should have meta property", () => {
    expect(PluginManifestsRegistry.meta).toBeDefined();
    expect(typeof PluginManifestsRegistry.meta).toBe("object");
  });

  test("should have settingsZodSchema property", () => {
    expect(PluginManifestsRegistry.settingsZodSchema).toBeDefined();
  });

  test("should have settingsFallbackValues property", () => {
    expect(PluginManifestsRegistry.settingsFallbackValues).toBeDefined();
    expect(typeof PluginManifestsRegistry.settingsFallbackValues).toBe(
      "object",
    );
  });

  test("should have getAllPluginDependencies method", () => {
    expect(PluginManifestsRegistry.getAllPluginDependencies).toBeDefined();
    expect(typeof PluginManifestsRegistry.getAllPluginDependencies).toBe(
      "function",
    );
  });

  test("should have register method", () => {
    expect(PluginManifestsRegistry.register).toBeDefined();
    expect(typeof PluginManifestsRegistry.register).toBe("function");
  });
});
