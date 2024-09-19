import { isMainWorldContext } from "@/utils/utils";

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
      console.error(`${error.stack?.split("\n")[1].trim()}: ${errorMessage}`);
    }

    return;
  };

  return wrappedFunction;
}

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

export function mainWorldExec<P extends unknown[], R>(
  callback: (...args: P) => R,
): (...args: P) => R | void {
  return mainWorldOnly(callback, true);
}

export function extensionExec<P extends unknown[], R>(
  callback: (...args: P) => R,
): (...args: P) => R | void {
  return extensionOnly(callback, true);
}
