import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Collection } from '@/components/QueryBox/CollectionSelector';
import { ImageModel } from '@/components/QueryBox/ImageModelSelector';
import {
  isValidFocus,
  LanguageModel,
  WebAccessFocus,
} from '@/types/ModelSelector';
import { chromeStorage } from '@/utils/chrome-store';
import pplxApi from '@/utils/pplx-api';

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

  selectedCollectionUuid: Collection['uuid'];
  setSelectedCollectionUuid: (
    selectedCollectionUuid: Collection['uuid']
  ) => void;
};

const useQueryBoxStore = create<QueryBoxState>()(
  immer((set) => ({
    selectedLanguageModel: 'turbo',
    setSelectedLanguageModel: async (selectedLanguageModel) => {
      if (await pplxApi.setDefaultLanguageModel(selectedLanguageModel))
        return set({ selectedLanguageModel });
    },
    selectedImageModel: 'default',
    setSelectedImageModel: async (selectedImageModel) => {
      if (await pplxApi.setDefaultImageModel(selectedImageModel))
        return set({ selectedImageModel });
    },
    queryLimit: 0,
    setQueryLimit: (queryLimit) => set({ queryLimit }),
    opusLimit: 0,
    setOpusLimit: (opusLimit) => set({ opusLimit }),
    imageCreateLimit: 0,
    setImageCreateLimit: (createLimit) =>
      set({ imageCreateLimit: createLimit }),

    webAccess: {
      focus: null,
      setFocus: (focus) => {
        chromeStorage.setStorageValue({
          key: 'defaultFocus',
          value: focus,
        });

        return set((state) => ({ webAccess: { ...state.webAccess, focus } }));
      },

      allowWebAccess: false,
      toggleWebAccess: (toggled) => {
        chromeStorage.setStorageValue({
          key: 'defaultWebAccess',
          value: !!toggled,
        });

        return set((state) => ({
          webAccess: {
            ...state.webAccess,
            allowWebAccess: toggled ?? !state.webAccess.allowWebAccess,
          },
        }));
      },

      proSearch: false,
      toggleProSearch: async (toggled) => {
        if (!(await pplxApi.setDefaultProSearch(!!toggled))) return;

        chromeStorage.setStorageValue({
          key: 'defaultProSearch',
          value: !!toggled,
        });

        return set((state) => ({
          webAccess: {
            ...state.webAccess,
            proSearch: toggled ?? !state.webAccess.proSearch,
          },
        }));
      },
    },

    selectedCollectionUuid: '',
    setSelectedCollectionUuid: (selectedCollectionUuid) =>
      set({ selectedCollectionUuid }),
  }))
);

const queryBoxStore = useQueryBoxStore;

async function initQueryBoxStore({
  languageModel,
  imageModel,
}: {
  languageModel?: LanguageModel['code'];
  imageModel?: ImageModel['code'];
}) {
  const { defaultFocus, defaultWebAccess, defaultProSearch } =
    await chromeStorage.getStore();
  if (isValidFocus(defaultFocus)) {
    queryBoxStore.setState((state) => {
      state.webAccess.focus = defaultFocus;
    });
  }

  queryBoxStore.setState((state) => {
    state.webAccess.allowWebAccess = defaultWebAccess;
    state.webAccess.proSearch = defaultProSearch;
  });

  queryBoxStore.setState((state) => {
    state.selectedLanguageModel = languageModel || state.selectedLanguageModel;
    state.selectedImageModel = imageModel || state.selectedImageModel;
  });
}

initQueryBoxStore({});

export { initQueryBoxStore, queryBoxStore, useQueryBoxStore };
