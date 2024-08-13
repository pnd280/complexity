import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  ImageModel,
  WebAccessFocus,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import PplxApi from "@/services/PplxApi";
import { Collection } from "@/types/collection.types";
import { isValidFocus } from "@/types/model-selector.types";
import ChromeStorage from "@/utils/ChromeStorage";
import { extensionExec } from "@/utils/hof";

type QueryBoxState = {
  selectedLanguageModel: LanguageModel["code"];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel["code"],
  ) => void;
  selectedImageModel: ImageModel["code"];
  setSelectedImageModel: (selectedImageModel: ImageModel["code"]) => void;
  queryLimit: number;
  setQueryLimit: (queryLimit: number) => void;
  opusLimit: number;
  setOpusLimit: (opusLimit: number) => void;
  imageCreateLimit: number;
  setImageCreateLimit: (createLimit: number) => void;

  webAccess: {
    focus: WebAccessFocus["code"] | null;
    setFocus: (focus: WebAccessFocus["code"] | null) => void;
    allowWebAccess: boolean;
    toggleWebAccess: (toggled?: boolean) => void;
  };

  selectedCollectionUuid: Collection["uuid"];
  setSelectedCollectionUuid: (
    selectedCollectionUuid: Collection["uuid"],
  ) => void;
};

const useQueryBoxStore = create<QueryBoxState>()(
  immer((set, get) => ({
    selectedLanguageModel: "turbo",
    setSelectedLanguageModel: async (selectedLanguageModel) => {
      if (await PplxApi.setDefaultLanguageModel(selectedLanguageModel))
        return set({ selectedLanguageModel });
    },
    selectedImageModel: "default",
    setSelectedImageModel: async (selectedImageModel) => {
      if (await PplxApi.setDefaultImageModel(selectedImageModel))
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
        ChromeStorage.setStorageValue({
          key: "defaultFocus",
          value: focus,
        });

        return set((state) => ({ webAccess: { ...state.webAccess, focus } }));
      },

      allowWebAccess: false,
      toggleWebAccess: async (toggled?: boolean) => {
        const state = get();
        const newValue = toggled ?? !state.webAccess.allowWebAccess;

        await ChromeStorage.setStorageValue({
          key: "defaultWebAccess",
          value: newValue,
        });

        set((state) => ({
          webAccess: {
            ...state.webAccess,
            allowWebAccess: newValue,
          },
        }));
      },
    },

    selectedCollectionUuid: "",
    setSelectedCollectionUuid: (selectedCollectionUuid) =>
      set({ selectedCollectionUuid }),
  })),
);

const queryBoxStore = useQueryBoxStore;

async function initQueryBoxStore({
  languageModel,
  imageModel,
}: {
  languageModel?: LanguageModel["code"];
  imageModel?: ImageModel["code"];
}) {
  const { defaultFocus, defaultWebAccess } = await ChromeStorage.getStore();
  if (isValidFocus(defaultFocus)) {
    queryBoxStore.setState((state) => {
      state.webAccess.focus = defaultFocus;
    });
  }

  queryBoxStore.setState((state) => {
    state.webAccess.allowWebAccess = defaultWebAccess;
  });

  queryBoxStore.setState((state) => {
    state.selectedLanguageModel = languageModel || state.selectedLanguageModel;
    state.selectedImageModel = imageModel || state.selectedImageModel;
  });
}

extensionExec(() => initQueryBoxStore({}))();

export { initQueryBoxStore, queryBoxStore, useQueryBoxStore };
