import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type Cookie = {
  name: string;
  value: string;
};

type PplxCookiesStoreType = {
  cookies: Cookie[];
};

export const pplxCookiesStore = createWithEqualityFn<PplxCookiesStoreType>()(
  subscribeWithSelector(
    immer(
      (): PplxCookiesStoreType => ({
        cookies: [],
      }),
    ),
  ),
);

export const usePplxCookiesStore = pplxCookiesStore;
