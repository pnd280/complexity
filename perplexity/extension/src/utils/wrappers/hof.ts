import { isMainWorldContext } from "@/utils/misc/utils";

/**
 * Creates a guarded function that only executes if a condition is met.
 * @param guardFn The function that checks the condition
 * @param callback The function to be executed if the condition is met
 * @param errorMessage The error message to display if the condition is not met
 * @param suppressGuardError Whether to suppress the error message
 * @returns A new function that includes the guard check
 * @example
 * const isPositive = (n: number) => n > 0;
 * const double = (n: number) => n * 2;
 * const guardedDouble = withGuard(isPositive, double, "Number must be positive");
 * console.log(guardedDouble(4)); // Output: 8
 * console.log(guardedDouble(-2)); // Output: Error: Number must be positive
 */
export function withGuard<P extends unknown[], R>(
  guardFn: (...args: P) => boolean,
  callback: (...args: P) => R,
  errorMessage: string = "Guard condition failed",
  suppressGuardError: boolean = false,
): (...args: P) => R | void {
  const wrappedFunction = function (this: unknown, ...args: P): R | void {
    if (guardFn(...args)) {
      return callback.apply(this, args);
    }

    if (!suppressGuardError) {
      const error = new Error(errorMessage);
      Error.captureStackTrace(error, wrappedFunction);
      const stackLine =
        error.stack?.split("\n")[1]?.trim() ?? "Unknown location";
      console.error(`${stackLine}: ${errorMessage}`);
    }

    return;
  };

  return wrappedFunction;
}

/**
 * Creates a function that only executes in the main world context.
 * @param callback The function to be executed in the main world context
 * @param suppressGuardError Whether to suppress the error message
 * @returns A new function that only executes in the main world context
 * @example
 * const mainWorldFunction = mainWorldOnly(() => console.log("In main world"));
 * mainWorldFunction(); // Logs "In main world" if in main world, otherwise shows an error
 */
export function mainWorldOnly<P extends unknown[], R>(
  callback: (...args: P) => R,
  suppressGuardError: boolean = false,
): (...args: P) => R | void {
  return withGuard(
    () => isMainWorldContext(),
    callback,
    "This function can only be called in the main world context.",
    suppressGuardError,
  );
}

/**
 * Creates a function that only executes in the extension context.
 * @param callback The function to be executed in the extension context
 * @param suppressGuardError Whether to suppress the error message
 * @returns A new function that only executes in the extension context
 * @example
 * const extensionFunction = extensionOnly(() => console.log("In extension"));
 * extensionFunction(); // Logs "In extension" if in extension context, otherwise shows an error
 */
export function extensionOnly<P extends unknown[], R>(
  callback: (...args: P) => R,
  suppressGuardError: boolean = false,
): (...args: P) => R | void {
  return withGuard(
    () => !isMainWorldContext(),
    callback,
    "This function can only be called in the extension context.",
    suppressGuardError,
  );
}

/**
 * Creates a function that executes in the main world context and suppresses guard errors.
 * @param callback The function to be executed in the main world context
 * @returns A new function that executes in the main world context with suppressed guard errors
 * @example
 * const silentMainWorldFunction = mainWorldExec(() => console.log("In main world"));
 * silentMainWorldFunction(); // Logs "In main world" if in main world, does nothing otherwise
 */
export function mainWorldExec<P extends unknown[], R>(
  callback: (...args: P) => R,
): (...args: P) => R | void {
  return mainWorldOnly(callback, true);
}

/**
 * Creates a function that executes in the extension context and suppresses guard errors.
 * @param callback The function to be executed in the extension context
 * @returns A new function that executes in the extension context with suppressed guard errors
 * @example
 * const silentExtensionFunction = extensionExec(() => console.log("In extension"));
 * silentExtensionFunction(); // Logs "In extension" if in extension context, does nothing otherwise
 */
export function extensionExec<P extends unknown[], R>(
  callback: (...args: P) => R,
): (...args: P) => R | void {
  return extensionOnly(callback, true);
}

/**
 * Wraps an async function with a timeout.
 * @param fn The async function to wrap
 * @param timeoutMs The timeout in milliseconds
 * @returns A new function that will reject if the original function doesn't complete within the timeout
 * @example
 * async function slowFunction(delay: number): Promise<string> {
 *   await new Promise((resolve) => setTimeout(resolve, delay));
 *   return "Operation completed successfully";
 * }
 *
 * const wrappedFunction = withTimeout(slowFunction, 2000);
 *
 * // This will complete successfully
 * wrappedFunction(1000)
 *   .then((result) => console.log(result))
 *   .catch((error) => console.error(error));
 *
 * // This will throw a timeout error
 * wrappedFunction(3000)
 *   .then((result) => console.log(result))
 *   .catch((error) => console.error(error));
 */
export function withTimeout<P extends unknown[], R>(
  fn: (...args: P) => Promise<R>,
  timeoutMs: number,
): (...args: P) => Promise<R> {
  return async (...args: P): Promise<R> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([fn(...args), timeoutPromise]);
  };
}
