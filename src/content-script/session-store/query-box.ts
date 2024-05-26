import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  isValidFocus,
  WebAccessFocus,
} from '@/components/QueryBox/FocusSelector';
import { ImageModel } from '@/components/QueryBox/ImageModelSelector';
import { LanguageModel } from '@/components/QueryBox/LanguageModelSelector';
import { chromeStorage } from '@/utils/chrome-store';

type QueryBoxState = {
  selectedLanguageModel: LanguageModel['code'];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel['code']
  ) => void;
  selectedImageModel: ImageModel['code'];
  setSelectedImageModel: (selectedImageModel: ImageModel['code']) => void;
  queryLimit: number;
  setQueryLimit: (queryLimit: number) => void;
  opusLimit: number;
  setOpusLimit: (opusLimit: number) => void;
  imageCreateLimit: number;
  setImageCreateLimit: (createLimit: number) => void;

  webAccess: {
    focus: WebAccessFocus['code'] | null;
    setFocus: (focus: WebAccessFocus['code'] | null) => void;
    allowWebAccess: boolean;
    toggleWebAccess: (toggled?: boolean) => void;
    proSearch: boolean;
    toggleProSearch: (toggled?: boolean) => void;
  };
};

const useQueryBoxStore = create<QueryBoxState>()(
  immer((set) => ({
    selectedLanguageModel: 'turbo',
    setSelectedLanguageModel: (selectedLanguageModel) =>
      set({ selectedLanguageModel }),
    selectedImageModel: 'default',
    setSelectedImageModel: (selectedImageModel) => set({ selectedImageModel }),
    queryLimit: 0,
    setQueryLimit: (queryLimit) => set({ queryLimit }),
    opusLimit: 0,
    setOpusLimit: (opusLimit) => set({ opusLimit }),
    imageCreateLimit: 0,
    setImageCreateLimit: (createLimit) =>
      set({ imageCreateLimit: createLimit }),

    webAccess: {
      focus: null,
      setFocus: (focus) =>
        set((state) => ({ webAccess: { ...state.webAccess, focus } })),

      allowWebAccess: false,
      toggleWebAccess: (toggled) =>
        set((state) => ({
          webAccess: {
            ...state.webAccess,
            allowWebAccess: toggled ?? !state.webAccess.allowWebAccess,
          },
        })),

      proSearch: false,
      toggleProSearch: (toggled) =>
        set((state) => ({
          webAccess: {
            ...state.webAccess,
            proSearch: toggled ?? !state.webAccess.proSearch,
          },
        })),
    },
  }))
);

const queryBoxStore = useQueryBoxStore;

(async function initQueryBoxStore() {
  const { defaultFocus, defaultWebAccess } = await chromeStorage.getStore();

  if (isValidFocus(defaultFocus)) {
    queryBoxStore.getState().webAccess.setFocus(defaultFocus);
  }

  queryBoxStore.getState().webAccess.toggleWebAccess(defaultWebAccess || false);
})();

export { queryBoxStore, useQueryBoxStore };
