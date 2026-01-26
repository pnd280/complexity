import { initI18n, type DotPaths, type Params } from "@/lib/init";

let i18n: Awaited<ReturnType<typeof initI18n>> | null = null;

export async function init(params: Parameters<typeof initI18n>[0]) {
  i18n = await initI18n(params);
}

export function t<S extends DotPaths>(
  key: S,
  ...args: keyof Params<S> extends never ? [] : [Params<S>]
): string {
  if (i18n == null) {
    return key;
  }

  // @ts-expect-error - t is overloaded, and this is the simplest way to call it
  return i18n.t(key, ...args);
}

type DotPrefix<T extends string> = T extends `${infer A}.${infer B}`
  ? A | `${A}.${DotPrefix<B>}`
  : never;

export type ValidPrefixes = DotPrefix<DotPaths>;

export type ExtractNestedPaths<
  P extends string,
  T extends DotPaths,
> = T extends `${P}.${infer Rest}` ? Rest : never;

export function extendT<P extends ValidPrefixes>(prefix: P) {
  function prefixedT<K extends ExtractNestedPaths<P, DotPaths>>(key: K): string;
  function prefixedT<K extends ExtractNestedPaths<P, DotPaths>>(
    key: K,
    args: Params<`${P}.${K}` & DotPaths>,
  ): string;
  function prefixedT<K extends ExtractNestedPaths<P, DotPaths>>(
    key: K,
    args?: unknown,
  ): string {
    const fullKey = `${prefix}.${key}` as unknown as DotPaths;
    if (args === undefined) {
      // @ts-expect-error - Overload resolution isn't working well with conditional types
      return t(fullKey);
    } else {
      // @ts-expect-error - Overload resolution isn't working well with conditional types
      return t(fullKey, args);
    }
  }

  return prefixedT;
}
