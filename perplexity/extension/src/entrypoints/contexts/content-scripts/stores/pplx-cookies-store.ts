import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

export type Cookie = {
  name: string;
  value: string;
};

type PplxCookiesStoreType = {
  cookies: Cookie[];
};

export const pplxCookiesStore = createWithEqualityFn<PplxCookiesStoreType>()(
  subscribeWithSelector(
    mutative(
      (): PplxCookiesStoreType => ({
        cookies: [],
      }),
    ),
  ),
);

export const usePplxCookiesStore = pplxCookiesStore;
