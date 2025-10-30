import type { MaybePromise } from "@/types/utils.types";

type ErrorWrapperResult<E, T> = [T, null] | [null, E];

/**
 * Wraps a function to provide consistent error handling and executes it immediately
 * @param callback The function to wrap (can be sync or async)
 * @param errorMessage Optional custom error message or data
 * @returns A tuple [result, error] where result is the value or null, and error is null or the error
 * @template TResult The type of the successful result
 */
export function tryCatch<TResult>(
  callback: () => Promise<TResult>,
): Promise<ErrorWrapperResult<Error, TResult>>;
export function tryCatch<TResult, TError>(
  callback: () => Promise<TResult>,
  errorMessage: TError,
): Promise<ErrorWrapperResult<TError, TResult>>;
export function tryCatch<TResult>(
  callback: () => TResult,
): ErrorWrapperResult<Error, TResult>;
export function tryCatch<TResult, TError>(
  callback: () => TResult,
  errorMessage: TError,
): ErrorWrapperResult<TError, TResult>;
export function tryCatch<TResult, TError = Error>(
  callback: () => MaybePromise<TResult>,
  errorMessage?: TError,
): MaybePromise<ErrorWrapperResult<TError, TResult>> {
  try {
    const result = callback();
    if (result instanceof Promise) {
      return result
        .then((value) => [value, null] as ErrorWrapperResult<TError, TResult>)
        .catch((error) => {
          let errorResult: TError;

          if (errorMessage !== undefined) {
            errorResult = errorMessage;
          } else {
            errorResult = new Error(
              error instanceof Error ? error.message : String(error),
              { cause: error },
            ) as TError;
          }

          return [null, errorResult] as ErrorWrapperResult<TError, TResult>;
        });
    }
    return [result, null] as ErrorWrapperResult<TError, TResult>;
  } catch (error) {
    let errorResult: TError;

    if (errorMessage !== undefined) {
      errorResult = errorMessage;
    } else {
      errorResult = new Error(
        error instanceof Error ? error.message : String(error),
        { cause: error },
      ) as TError;
    }

    return [null, errorResult] as ErrorWrapperResult<TError, TResult>;
  }
}
