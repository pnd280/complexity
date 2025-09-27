import type { MaybePromise } from "@/types/utils.types";

type ErrorWrapperResult<T> = [T, null] | [null, Error];

/**
 * Wraps a function to provide consistent error handling
 * @param callback The function to wrap (can be sync or async)
 * @param errorMessage Optional custom error message
 * @returns A wrapped version of the callback that returns [result, error]
 */
export function errorWrapper<TResult>(
  callback: () => Promise<TResult>,
  errorMessage?: string,
): () => Promise<ErrorWrapperResult<TResult>>;
export function errorWrapper<TResult>(
  callback: () => TResult,
  errorMessage?: string,
): () => ErrorWrapperResult<TResult>;
export function errorWrapper<TResult>(
  callback: () => MaybePromise<TResult>,
  errorMessage?: string,
): () => MaybePromise<ErrorWrapperResult<TResult>> {
  return () => {
    try {
      const result = callback();
      if (result instanceof Promise) {
        return result
          .then((value) => [value, null] as ErrorWrapperResult<TResult>)
          .catch((error) => {
            const message =
              errorMessage || "An error occurred during operation";
            const wrappedError = new Error(
              `${message}: ${error instanceof Error ? error.message : String(error)}`,
              { cause: error },
            );
            return [null, wrappedError] as ErrorWrapperResult<TResult>;
          });
      }
      return [result, null] as ErrorWrapperResult<TResult>;
    } catch (error) {
      const message = errorMessage || "An error occurred during operation";
      const wrappedError = new Error(
        `${message}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
      return [null, wrappedError] as ErrorWrapperResult<TResult>;
    }
  };
}
