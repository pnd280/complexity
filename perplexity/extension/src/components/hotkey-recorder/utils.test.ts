import { describe, expect, it } from "vitest";

import {
  isValidKeyCombination,
  normalizeEventKeyName,
  normalizeKeyName,
  orderKeys,
} from "@/components/hotkey-recorder/utils";

type MockKeyboardEventParams = {
  key: string;
  code: string;
  altKey?: boolean;
};

function createKeyboardEvent(params: MockKeyboardEventParams): KeyboardEvent {
  const { altKey = false, code, key } = params;

  return {
    altKey,
    code,
    key,
  } as KeyboardEvent;
}

describe("normalizeKeyName", () => {
  it("normalizes existing special names", () => {
    expect(normalizeKeyName(" ")).toBe("Space");
    expect(normalizeKeyName("Control")).toBe("Ctrl");
    expect(normalizeKeyName("Unidentified")).toBe("");
  });
});

describe("normalizeEventKeyName", () => {
  it("canonicalizes Alt+KeyT glyph output to t", () => {
    const event = createKeyboardEvent({
      altKey: true,
      code: "KeyT",
      key: "†",
    });

    expect(normalizeEventKeyName(event)).toBe("t");
  });

  it("canonicalizes Alt+KeyY glyph output to y", () => {
    const event = createKeyboardEvent({
      altKey: true,
      code: "KeyY",
      key: "¥",
    });

    expect(normalizeEventKeyName(event)).toBe("y");
  });

  it("canonicalizes Alt+Digit code output", () => {
    const event = createKeyboardEvent({
      altKey: true,
      code: "Digit1",
      key: "¡",
    });

    expect(normalizeEventKeyName(event)).toBe("1");
  });

  it("does not rewrite non-Alt keys", () => {
    const event = createKeyboardEvent({
      altKey: false,
      code: "KeyT",
      key: "†",
    });

    expect(normalizeEventKeyName(event)).toBe("†");
  });

  it("keeps existing unidentified behavior", () => {
    const event = createKeyboardEvent({
      altKey: true,
      code: "KeyT",
      key: "Unidentified",
    });

    expect(normalizeEventKeyName(event)).toBe("");
  });
});

describe("combination validation and ordering", () => {
  it("preserves valid modifier+single-key behavior", () => {
    expect(isValidKeyCombination(new Set(["Alt", "t"]))).toBe(true);
    expect(isValidKeyCombination(new Set(["t"]))).toBe(false);
    expect(isValidKeyCombination(new Set(["Alt", "t", "y"]))).toBe(false);
  });

  it("preserves modifier ordering", () => {
    expect(orderKeys(["k", "Alt", "Ctrl"])).toEqual(["Ctrl", "Alt", "k"]);
  });
});
