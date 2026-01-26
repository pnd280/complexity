import { describe, it, expect } from "vitest";

import { tryCatch } from "@/utils/wrappers/try-catch";

describe("tryCatch", () => {
  describe("synchronous execution", () => {
    describe("successful execution", () => {
      it("should return [result, null] when callback succeeds", () => {
        const [result, error] = tryCatch(() => "success");
        expect(result).toBe("success");
        expect(error).toBeNull();
      });

      it("should work with different return types", () => {
        const [stringResult] = tryCatch(() => "hello");
        expect(stringResult).toBe("hello");

        const [numberResult] = tryCatch(() => 42);
        expect(numberResult).toBe(42);

        const [objectResult] = tryCatch(() => ({ key: "value" }));
        expect(objectResult).toEqual({ key: "value" });

        const [arrayResult] = tryCatch(() => [1, 2, 3]);
        expect(arrayResult).toEqual([1, 2, 3]);

        const [nullResult] = tryCatch(() => null);
        expect(nullResult).toBeNull();

        const [undefinedResult] = tryCatch(() => undefined);
        expect(undefinedResult).toBeUndefined();
      });
    });

    describe("error handling", () => {
      it("should return [null, Error] when callback throws Error", () => {
        const result = tryCatch((): string => {
          throw new Error("test error");
        });
        const [value, error] = result;

        expect(value).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("test error");
      });

      it("should convert non-Error values to Error with message", () => {
        const result1 = tryCatch((): string => {
          throw "string error";
        });
        const [value1, error1] = result1;
        expect(value1).toBeNull();
        expect(error1).toBeInstanceOf(Error);
        expect((error1 as Error).message).toBe("string error");
        expect((error1 as Error).cause).toBe("string error");

        const result2 = tryCatch((): number => {
          throw 123;
        });
        const [value2, error2] = result2;
        expect(value2).toBeNull();
        expect(error2).toBeInstanceOf(Error);
        expect((error2 as Error).message).toBe("123");
        expect((error2 as Error).cause).toBe(123);

        const result3 = tryCatch((): null => {
          throw null;
        });
        const [value3, error3] = result3;
        expect(value3).toBeNull();
        expect(error3).toBeInstanceOf(Error);
        expect((error3 as Error).message).toBe("null");
        expect((error3 as Error).cause).toBe(null);
      });

      it("should preserve original error as cause property", () => {
        const originalError = new Error("original");
        const result = tryCatch((): string => {
          throw originalError;
        });
        const [value, error] = result;

        expect(value).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("original");
        expect((error as Error).cause).toBe(originalError);
      });
    });

    describe("custom error message handling", () => {
      it("should use custom error string when provided", () => {
        const result = tryCatch((): string => {
          throw new Error("original error");
        }, "custom error message");
        const [value, error] = result;

        expect(value).toBeNull();
        expect(error).toBe("custom error message");
      });

      it("should use custom error object when provided", () => {
        const customError = { code: 500, message: "custom error" };
        const result = tryCatch((): string => {
          throw new Error("original error");
        }, customError);
        const [value, error] = result;

        expect(value).toBeNull();
        expect(error).toBe(customError);
      });

      it("should use custom error for non-Error thrown values", () => {
        const customError = "my custom error";
        const result = tryCatch((): string => {
          throw "thrown string";
        }, customError);
        const [value, error] = result;

        expect(value).toBeNull();
        expect(error).toBe(customError);
      });
    });
  });

  describe("asynchronous execution", () => {
    describe("successful execution", () => {
      it("should return Promise that resolves to [result, null] when callback succeeds", async () => {
        const [result, error] = await tryCatch(async () => "success");
        expect(result).toBe("success");
        expect(error).toBeNull();
      });

      it("should work with different return types", async () => {
        const [stringResult] = await tryCatch(async () => "hello");
        expect(stringResult).toBe("hello");

        const [numberResult] = await tryCatch(async () => 42);
        expect(numberResult).toBe(42);

        const [objectResult] = await tryCatch(async () => ({
          key: "value",
        }));
        expect(objectResult).toEqual({ key: "value" });
      });

      it("should handle async operations", async () => {
        const [result] = await tryCatch(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return "delayed result";
        });

        expect(result).toBe("delayed result");
      });
    });

    describe("error handling", () => {
      it("should return Promise that resolves to [null, Error] when callback rejects", async () => {
        const [result, error] = await tryCatch(async () => {
          throw new Error("async error");
        });

        expect(result).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("async error");
      });

      it("should preserve original error as cause property", async () => {
        const originalError = new Error("original async error");
        const [result, error] = await tryCatch(async () => {
          throw originalError;
        });

        expect(result).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("original async error");
        expect((error as Error).cause).toBe(originalError);
      });

      it("should convert non-Error rejected values to Error", async () => {
        const [result1, error1] = await tryCatch(async () => {
          throw "string error";
        });
        expect(result1).toBeNull();
        expect(error1).toBeInstanceOf(Error);
        expect((error1 as Error).message).toBe("string error");
        expect((error1 as Error).cause).toBe("string error");

        const [result2, error2] = await tryCatch(async () => {
          throw 123;
        });
        expect(result2).toBeNull();
        expect(error2).toBeInstanceOf(Error);
        expect((error2 as Error).message).toBe("123");
        expect((error2 as Error).cause).toBe(123);
      });

      it("should handle rejected Promise with Error", async () => {
        const [result, error] = await tryCatch(async () => {
          return Promise.reject(new Error("rejected error"));
        });

        expect(result).toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("rejected error");
      });
    });

    describe("custom error message handling", () => {
      it("should use custom error string when provided", async () => {
        const [result, error] = await tryCatch(async () => {
          throw new Error("original error");
        }, "custom async error message");

        expect(result).toBeNull();
        expect(error).toBe("custom async error message");
      });

      it("should use custom error object when provided", async () => {
        const customError = { code: 500, message: "custom async error" };
        const [result, error] = await tryCatch(async () => {
          throw new Error("original error");
        }, customError);

        expect(result).toBeNull();
        expect(error).toBe(customError);
      });

      it("should use custom error for non-Error rejected values", async () => {
        const customError = "my custom async error";
        const [result, error] = await tryCatch(async () => {
          throw "thrown string";
        }, customError);

        expect(result).toBeNull();
        expect(error).toBe(customError);
      });

      it("should use custom error for rejected Promise", async () => {
        const customError = "custom rejection error";
        const [result, error] = await tryCatch(async () => {
          return Promise.reject(new Error("rejected"));
        }, customError);

        expect(result).toBeNull();
        expect(error).toBe(customError);
      });
    });
  });
});
