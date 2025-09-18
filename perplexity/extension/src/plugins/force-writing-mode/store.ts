import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type ForceWritingModeStore = {
  spacesThreadsForceWritingMode: boolean;
  setSpacesThreadsForceWritingMode: (enable: boolean) => void;
};

export const forceWritingModeStore =
  createWithEqualityFn<ForceWritingModeStore>()(
    subscribeWithSelector(
      immer(
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
