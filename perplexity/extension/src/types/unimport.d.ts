/* eslint-disable @typescript-eslint/consistent-type-imports */
export {};
declare global {
  const { Key }: typeof import("ts-key-enum");
  const {
    Trans,
    TransWithPrefix,
    extendT,
    t,
  }: typeof import("@complexity/i18n");
  const { cn }: typeof import("@/utils/wrappers/cn.ts");
  const {
    createContext,
    lazy,
    memo,
    use,
    useCallback,
    useContext,
    useDeferredValue,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
  }: typeof import("react");
  const { deepEqual }: typeof import("@/utils/wrappers/deep-equal.ts");
  const { default: $ }: typeof import("jquery");
  const {
    isExtensionContext,
    isMainWorldContext,
    sleep,
  }: typeof import("@/utils/misc/utils.ts");
  const invariant: typeof import("@/utils/misc/utils.ts").invariant;
  const {
    onlyExtensionGuard,
    onlyMainWorldGuard,
  }: typeof import("@/utils/wrappers/js-context-guards.ts");
}
