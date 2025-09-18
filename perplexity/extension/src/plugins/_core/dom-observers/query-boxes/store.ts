import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type QueryBoxesDomObserverStoreType = {
  wrapper: {
    main: HTMLElement | null;
    space: HTMLElement | null;
    followUp: HTMLElement | null;
    cometAssistant: HTMLElement | null;
  };

  setWrapperNodes: (wrapper: {
    main?: HTMLElement | null;
    space?: HTMLElement | null;
    followUp?: HTMLElement | null;
    cometAssistant?: HTMLElement | null;
  }) => void;

  textbox: {
    main: HTMLElement | null;
    space: HTMLElement | null;
    followUp: HTMLElement | null;
    cometAssistant: HTMLElement | null;
  };

  setTextboxNodes: (textbox: {
    main?: HTMLElement | null;
    space?: HTMLElement | null;
    followUp?: HTMLElement | null;
    cometAssistant?: HTMLElement | null;
  }) => void;

  resetStore: () => void;
};

export const queryBoxesDomObserverStore =
  createWithEqualityFn<QueryBoxesDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set, get): QueryBoxesDomObserverStoreType => ({
          wrapper: {
            main: null,
            space: null,
            followUp: null,
            cometAssistant: null,
          },
          textbox: {
            main: null,
            space: null,
            followUp: null,
            cometAssistant: null,
          },

          setWrapperNodes: (wrapper) => {
            set({
              wrapper: {
                ...get().wrapper,
                ...wrapper,
              },
            });
          },

          setTextboxNodes: (textbox) => {
            set({
              textbox: {
                ...get().textbox,
                ...textbox,
              },
            });
          },

          resetStore: () => {
            set({
              wrapper: {
                main: null,
                space: null,
                followUp: null,
                cometAssistant: null,
              },
              textbox: {
                main: null,
                space: null,
                followUp: null,
                cometAssistant: null,
              },
            });
          },
        }),
      ),
    ),
  );

export const useQueryBoxesDomObserverStore = queryBoxesDomObserverStore;
