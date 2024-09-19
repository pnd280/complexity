import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  ImageModel,
  FocusMode,
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
  o1Limit: number;
  setO1Limit: (o1Limit: number) => void;
  imageCreateLimit: number;
  setImageCreateLimit: (createLimit: number) => void;
  focusMode: FocusMode["code"] | null;
  setFocusMode: (focusMode: FocusMode["code"] | null) => void;
  selectedCollectionUuid: Collection["uuid"];
  setSelectedCollectionUuid: (
    selectedCollectionUuid: Collection["uuid"],
  ) => void;
};

const useQueryBoxStore = create<QueryBoxState>()(
  immer((set) => ({
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
    o1Limit: 0,
    setO1Limit: (o1Limit) => set({ o1Limit }),
    imageCreateLimit: 0,
    setImageCreateLimit: (createLimit) =>
      set({ imageCreateLimit: createLimit }),

    focusMode: null,
    setFocusMode: (focusMode) => {
      ChromeStorage.setStorageValue({
        key: "defaultFocusMode",
        value: focusMode,
      });

      return set({ focusMode });
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
  const { defaultFocusMode } = await ChromeStorage.getStore();
  if (isValidFocus(defaultFocusMode)) {
    queryBoxStore.setState((state) => {
      state.focusMode = defaultFocusMode;
    });
  }

  queryBoxStore.setState((state) => {
    state.selectedLanguageModel = languageModel || state.selectedLanguageModel;
    state.selectedImageModel = imageModel || state.selectedImageModel;
  });
}

extensionExec(() => initQueryBoxStore({}))();

export { initQueryBoxStore, queryBoxStore, useQueryBoxStore };
