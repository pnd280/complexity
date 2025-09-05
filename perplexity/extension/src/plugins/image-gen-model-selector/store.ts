import { QueryObserver } from "@tanstack/react-query";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { queryClient } from "@/data/query-client";
import { pluginGuardsStore } from "@/plugins/_core/plugins-guard/store";
import {
  isImageModelCode,
  type ImageModel,
} from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { PplxApiService } from "@/services/externals/pplx-api";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { extensionExec } from "@/utils/hof";

type ImageGenModelSelectorStore = {
  selectedImageGenModel: ImageModel["code"];
  setSelectedImageGenModel: (selectedImageGenModel: ImageModel["code"]) => void;
};

const useImageGenModelSelectorStore =
  createWithEqualityFn<ImageGenModelSelectorStore>()(
    subscribeWithSelector(
      immer(
        (set): ImageGenModelSelectorStore => ({
          selectedImageGenModel: "default",
          setSelectedImageGenModel: async (selectedImageGenModel) => {
            set({ selectedImageGenModel });
            await PplxApiService.setDefaultImageGenModel(selectedImageGenModel);
            queryClient.invalidateQueries({
              queryKey: pplxApiQueries.userSettings.all(),
            });
          },
        }),
      ),
    ),
  );

const imageGenModelSelectorStore = useImageGenModelSelectorStore;

async function initImageGenModelSelectorStore() {
  let firstTime = true;

  pluginGuardsStore.subscribe(
    (state) => state.isLoggedIn,
    (isLoggedIn) => {
      new QueryObserver(
        queryClient,
        pplxApiQueries.userSettings.detail(isLoggedIn),
      ).subscribe((data) => {
        if (data.data && firstTime) {
          imageGenModelSelectorStore.setState((state) => {
            state.selectedImageGenModel = isImageModelCode(
              data.data.default_image_generation_model,
            )
              ? data.data.default_image_generation_model
              : "default";
          });

          firstTime = false;
        }
      });
    },
  );
}

extensionExec(() => initImageGenModelSelectorStore())();

export {
  initImageGenModelSelectorStore,
  imageGenModelSelectorStore,
  useImageGenModelSelectorStore,
};
