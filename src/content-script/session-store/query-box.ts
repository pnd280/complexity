import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import {
  ImageModel,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import PplxApi from "@/services/PplxApi";
import { Space } from "@/types/space.types";
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
  selectedSpaceUuid: Space["uuid"];
  setSelectedSpaceUuid: (selectedSpaceUuid: Space["uuid"]) => void;
};

const useQueryBoxStore = createWithEqualityFn<QueryBoxState>()(
  immer(
    (set): QueryBoxState => ({
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

      selectedSpaceUuid: "",
      setSelectedSpaceUuid: (selectedSpaceUuid) => set({ selectedSpaceUuid }),
    }),
  ),
);

const queryBoxStore = useQueryBoxStore;

async function initQueryBoxStore({
  languageModel,
  imageModel,
}: {
  languageModel?: LanguageModel["code"];
  imageModel?: ImageModel["code"];
}) {
  queryBoxStore.setState((state) => {
    state.selectedLanguageModel = languageModel || state.selectedLanguageModel;
    state.selectedImageModel = imageModel || state.selectedImageModel;
  });
}

extensionExec(() => initQueryBoxStore({}))();

export { initQueryBoxStore, queryBoxStore, useQueryBoxStore };
