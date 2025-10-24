import { useLayoutEffect, useRef } from "react";

type Fn<ARGS extends unknown[], R> = (...args: ARGS) => R;

/**
 * Returns a memoized callback that always has access to the latest version
 * of the function while maintaining a stable reference.
 *
 * This hook is useful for callbacks that need to be passed to child components or event listeners
 * without causing unnecessary re-renders, while still having access to the latest props and state.
 *
 * @template A - The array type representing the function's arguments
 * @template R - The return type of the function
 * @param {Fn<A, R>} fn - The function to memoize
 * @returns {Fn<A, R>} A stable function reference that always calls the latest version of the provided function
 *
 * @example
 * // In a component:
 * const handleClick = useEvent((id) => {
 *   // This will always have access to latest props/state
 *   console.log(`Clicked item ${id} in ${currentView}`);
 * });
 */
export function useEvent<A extends unknown[], R>(fn: Fn<A, R>): Fn<A, R> {
  const fnRef = useRef<Fn<A, R>>(fn);

  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  return (...args: A): R => {
    return fnRef.current(...args);
  };
}
