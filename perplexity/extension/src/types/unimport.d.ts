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
  const { cn }: typeof import("@/utils/cn.ts");
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
  const { deepEqual }: typeof import("@/utils/deep-equal.ts");
  const { default: $ }: typeof import("jquery");
  const {
    isExtensionContext,
    isMainWorldContext,
    sleep,
  }: typeof import("@/utils/utils.ts");
  const invariant: typeof import("@/utils/utils.ts").invariant;
  const {
    onlyExtensionGuard,
    onlyMainWorldGuard,
  }: typeof import("@/utils/js-context-guards.ts");
}
