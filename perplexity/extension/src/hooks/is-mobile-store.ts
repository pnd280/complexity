import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

const MOBILE_BREAKPOINT = 768;

type IsMobileStore = {
  isMobile: boolean;
};

const useIsMobileStore = createWithEqualityFn<IsMobileStore>()(
  subscribeWithSelector(
    immer(
      (set): IsMobileStore => ({
        isMobile:
          typeof window !== "undefined"
            ? window.innerWidth < MOBILE_BREAKPOINT
            : false,
      }),
    ),
  ),
);

const isMobileStore = useIsMobileStore;

function initIsMobileStore() {
  if (typeof window === "undefined") return;

  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const onChange = () => {
    isMobileStore.setState({ isMobile: window.innerWidth < MOBILE_BREAKPOINT });
  };
  mql.addEventListener("change", onChange);
}

initIsMobileStore();

export { isMobileStore, useIsMobileStore };
