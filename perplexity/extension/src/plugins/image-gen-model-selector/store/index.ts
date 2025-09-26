import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { type ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { PplxApiService } from "@/services/externals/pplx-api";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";

type ImageGenModelSelectorStore = {
  selectedImageGenModel: ImageModel["code"];
  setSelectedImageGenModel: (selectedImageGenModel: ImageModel["code"]) => void;
};

export const imageGenModelSelectorStore =
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

export const useImageGenModelSelectorStore = imageGenModelSelectorStore;
