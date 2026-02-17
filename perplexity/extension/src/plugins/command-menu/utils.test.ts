import { describe, expect, it } from "vitest";

import { normalizeCommandMenuKeybinding } from "@/plugins/command-menu/utils";

describe("normalizeCommandMenuKeybinding", () => {
  it("normalizes legacy Alt+† binding to Alt+t", () => {
    expect(normalizeCommandMenuKeybinding(["Alt", "†"])).toEqual(["Alt", "t"]);
  });

  it("normalizes legacy Alt+¥ binding to Alt+y", () => {
    expect(normalizeCommandMenuKeybinding(["Alt", "¥"])).toEqual(["Alt", "y"]);
  });

  it("keeps non-legacy keybindings unchanged", () => {
    expect(normalizeCommandMenuKeybinding(["Meta", "i"])).toEqual([
      "Meta",
      "i",
    ]);
    expect(normalizeCommandMenuKeybinding(["Ctrl", "k"])).toEqual([
      "Ctrl",
      "k",
    ]);
  });

  it("does not rewrite glyphs when Alt is absent", () => {
    expect(normalizeCommandMenuKeybinding(["Meta", "†"])).toEqual([
      "Meta",
      "†",
    ]);
  });
});
