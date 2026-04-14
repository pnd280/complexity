import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

const MOBILE_BREAKPOINT = 768;

type ViewportStore = {
  isMobile: boolean;
  windowWidth: number;
};

function getViewportState(): ViewportStore {
  if (typeof window === "undefined") {
    return {
      isMobile: false,
      windowWidth: 0,
    };
  }

  const windowWidth = Math.round(
    window.visualViewport?.width ?? document.documentElement.clientWidth,
  );

  return {
    isMobile: windowWidth < MOBILE_BREAKPOINT,
    windowWidth,
  };
}

const useViewport = createWithEqualityFn<ViewportStore>()(
  subscribeWithSelector(mutative(() => getViewportState())),
);

const viewportStore = useViewport;

let isViewportStoreInitialized = false;

function initViewportStore() {
  if (typeof window === "undefined" || isViewportStoreInitialized) return;

  const syncViewportState = () => {
    viewportStore.setState(getViewportState());
  };

  window.addEventListener("resize", syncViewportState);
  window.visualViewport?.addEventListener("resize", syncViewportState);

  isViewportStoreInitialized = true;
}

initViewportStore();

export { viewportStore, useViewport };
