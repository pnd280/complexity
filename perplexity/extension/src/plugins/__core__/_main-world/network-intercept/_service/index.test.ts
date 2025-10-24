import { describe, it, expect, beforeEach, vi } from "vitest";

import { NetworkInterceptMiddlewareManagerImpl } from "@/plugins/__core__/_main-world/network-intercept/_service";
import type { Middleware } from "@/plugins/__core__/_main-world/network-intercept/_service/types";
import type { MiddlewareData } from "@/plugins/__core__/_main-world/network-intercept/listeners.types";

const networkInterceptMiddlewareManager =
  NetworkInterceptMiddlewareManagerImpl.getInstance();

describe("middlewareManager", () => {
  beforeEach(() => {
    // Clear all middlewares before each test
    networkInterceptMiddlewareManager.getMiddlewares().forEach((middleware) => {
      networkInterceptMiddlewareManager.removeMiddleware(middleware.id);
    });
  });

  it("should be a singleton", () => {
    const instance1 = networkInterceptMiddlewareManager;
    const instance2 = networkInterceptMiddlewareManager;
    expect(instance1).toBe(instance2);
  });

  describe("addMiddleware", () => {
    it("should add middleware to the chain", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);
      expect(networkInterceptMiddlewareManager.getMiddlewares()).toContain(
        middleware,
      );
    });

    it("should throw error when adding middleware with duplicate id", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);
      expect(() =>
        networkInterceptMiddlewareManager.addMiddleware(middleware),
      ).toThrow("Middleware with id test already exists");
    });

    it("should respect 'first' priority", () => {
      const middleware1: Middleware = {
        id: "first",
        middlewareFn: vi.fn(),
        priority: { position: "first" },
      };
      const middleware2: Middleware = {
        id: "second",
        middlewareFn: vi.fn(),
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware2);
      networkInterceptMiddlewareManager.addMiddleware(middleware1);

      expect(networkInterceptMiddlewareManager.getMiddlewares()[0]).toBe(
        middleware1,
      );
    });

    it("should respect 'beforeId' priority", () => {
      const middleware1: Middleware = {
        id: "target",
        middlewareFn: vi.fn(),
      };
      const middleware2: Middleware = {
        id: "before",
        middlewareFn: vi.fn(),
        priority: { position: "beforeId", id: "target" },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware1);
      networkInterceptMiddlewareManager.addMiddleware(middleware2);

      expect(networkInterceptMiddlewareManager.getMiddlewares()[0]).toBe(
        middleware2,
      );
    });
  });

  describe("updateMiddleware", () => {
    it("should update existing middleware", () => {
      const originalMiddleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };
      const updatedMiddleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      networkInterceptMiddlewareManager.addMiddleware(originalMiddleware);
      networkInterceptMiddlewareManager.updateMiddleware(updatedMiddleware);

      expect(networkInterceptMiddlewareManager.getMiddlewares()).toContain(
        updatedMiddleware,
      );
      expect(networkInterceptMiddlewareManager.getMiddlewares()).not.toContain(
        originalMiddleware,
      );
    });
  });

  describe("removeMiddleware", () => {
    it("should remove middleware from the chain", () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: vi.fn(),
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);
      networkInterceptMiddlewareManager.removeMiddleware("test");

      expect(networkInterceptMiddlewareManager.getMiddlewares()).not.toContain(
        middleware,
      );
    });
  });

  describe("executeMiddlewares", () => {
    it("should execute middlewares in order", async () => {
      const order: number[] = [];
      const middleware1: Middleware = {
        id: "1",
        middlewareFn: async ({ data: _data }) => {
          order.push(1);
          return "test-data";
        },
      };
      const middleware2: Middleware = {
        id: "2",
        middlewareFn: async ({ data: _data }) => {
          order.push(2);
          return "test-data";
        },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware1);
      networkInterceptMiddlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await networkInterceptMiddlewareManager.executeMiddlewares({
        data: testData,
      });
      expect(order).toEqual([1, 2]);
    });

    it("should stop propagation when requested", async () => {
      const order: number[] = [];
      const middleware1: Middleware = {
        id: "1",
        middlewareFn: async ({ data: _data, stopPropagation }) => {
          order.push(1);
          stopPropagation();
          return "test-data";
        },
      };
      const middleware2: Middleware = {
        id: "2",
        middlewareFn: async ({ data: _data }) => {
          order.push(2);
          return "test-data";
        },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware1);
      networkInterceptMiddlewareManager.addMiddleware(middleware2);

      const testData: MiddlewareData = {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await networkInterceptMiddlewareManager.executeMiddlewares({
        data: testData,
      });
      expect(order).toEqual([1]);
    });

    it("should allow middleware to skip processing", async () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async ({ skip }) => {
          return skip();
        },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      const result = await networkInterceptMiddlewareManager.executeMiddlewares(
        {
          data: testData,
        },
      );
      expect(result.payload.data).toBe("test");
    });

    it("should allow middleware to remove itself", async () => {
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async ({ removeMiddleware, data: _data }) => {
          removeMiddleware();
          return "test-data";
        },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await networkInterceptMiddlewareManager.executeMiddlewares({
        data: testData,
      });
      expect(networkInterceptMiddlewareManager.getMiddlewares()).not.toContain(
        middleware,
      );
    });

    it("should propagate errors that are not STOP_PROPAGATION", async () => {
      const error = new Error("Test error");
      const middleware: Middleware = {
        id: "test",
        middlewareFn: async () => {
          throw error;
        },
      };

      networkInterceptMiddlewareManager.addMiddleware(middleware);

      const testData: MiddlewareData = {
        type: "networkIntercept:fetchEvent",
        event: "request",
        payload: {
          url: "https://test.com",
          data: "test",
        },
      };

      await expect(
        networkInterceptMiddlewareManager.executeMiddlewares({
          data: testData,
        }),
      ).rejects.toThrow(error);
    });
  });
});
