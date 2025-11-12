import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

type ForceWritingModeStore = {
  spacesThreadsForceWritingMode: boolean;
  setSpacesThreadsForceWritingMode: (enable: boolean) => void;
};

export const forceWritingModeStore =
  createWithEqualityFn<ForceWritingModeStore>()(
    subscribeWithSelector(
      mutative(
        (set): ForceWritingModeStore => ({
          spacesThreadsForceWritingMode: false,
          setSpacesThreadsForceWritingMode: (forceWritingMode) => {
            set({ spacesThreadsForceWritingMode: forceWritingMode });
          },
        }),
      ),
    ),
  );

export const useForceWritingModeStore = forceWritingModeStore;
