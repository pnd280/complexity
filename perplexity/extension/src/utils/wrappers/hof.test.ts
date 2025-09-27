import { describe, it, expect, vi, beforeEach } from "vitest";

import * as utils from "@/utils/misc/utils";
import {
  withGuard,
  mainWorldOnly,
  extensionOnly,
  mainWorldExec,
  extensionExec,
  withTimeout,
} from "@/utils/wrappers/hof";

describe("Higher-Order Functions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("withGuard", () => {
    it("should execute the callback when guard condition is met", () => {
      const isPositive = (n: number) => n > 0;
      const double = (n: number) => n * 2;
      const guardedDouble = withGuard(
        isPositive,
        double,
        "Number must be positive",
      );

      expect(guardedDouble(4)).toBe(8);
    });

    it("should not execute the callback and log error when guard condition is not met", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const isPositive = (n: number) => n > 0;
      const double = (n: number) => n * 2;
      const guardedDouble = withGuard(
        isPositive,
        double,
        "Number must be positive",
      );

      expect(guardedDouble(-2)).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Number must be positive"),
      );
    });

    it("should not log error when suppressGuardError is true", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const isPositive = (n: number) => n > 0;
      const double = (n: number) => n * 2;
      const guardedDouble = withGuard(
        isPositive,
        double,
        "Number must be positive",
        true,
      );

      expect(guardedDouble(-2)).toBeUndefined();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("mainWorldOnly", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should execute the callback in main world context", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(true);
      const callback = vi.fn();
      const mainWorldFunction = mainWorldOnly(callback);

      mainWorldFunction();
      expect(callback).toHaveBeenCalled();
    });

    it("should not execute the callback in extension context", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(false);
      const callback = vi.fn();
      const mainWorldFunction = mainWorldOnly(callback);

      mainWorldFunction();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("extensionOnly", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should execute the callback in extension context", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(false);
      const callback = vi.fn();
      const extensionFunction = extensionOnly(callback);

      extensionFunction();
      expect(callback).toHaveBeenCalled();
    });

    it("should not execute the callback in main world context", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(true);
      const callback = vi.fn();
      const extensionFunction = extensionOnly(callback);

      extensionFunction();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("mainWorldExec", () => {
    it("should execute the callback in main world context without logging errors", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(true);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const callback = vi.fn();
      const mainWorldFunction = mainWorldExec(callback);

      mainWorldFunction();
      expect(callback).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("extensionExec", () => {
    it("should execute the callback in extension context without logging errors", () => {
      vi.spyOn(utils, "isMainWorldContext").mockReturnValue(false);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const callback = vi.fn();
      const extensionFunction = extensionExec(callback);

      extensionFunction();
      expect(callback).toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("withTimeout", () => {
    it("should resolve when the function completes within the timeout", async () => {
      const fn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "success";
      };
      const wrappedFn = withTimeout(fn, 100);

      await expect(wrappedFn()).resolves.toBe("success");
    });

    it("should reject when the function exceeds the timeout", async () => {
      const fn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return "success";
      };
      const wrappedFn = withTimeout(fn, 100);

      await expect(wrappedFn()).rejects.toThrow(
        "Operation timed out after 100ms",
      );
    });
  });
});
