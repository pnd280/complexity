import { fakeBrowser } from "@webext-core/fake-browser";
import { vi } from "vitest";

vi.mock("webextension-polyfill", () => ({
  default: fakeBrowser,
}));
