export type ComctxProxy<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any
    ? K
    : never]: T[K] extends (...args: any[]) => any
    ? T[K] extends (...args: any[]) => Promise<any>
      ? T[K]
      : (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>
    : never;
};
