import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { type ImageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { PplxApiService } from "@/entrypoints/services/externals/pplx-api";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";

type ImageGenModelSelectorStore = {
  model: ImageModel["code"];
  setModel: (selectedImageGenModel: ImageModel["code"]) => void;
};

export const imageGenModelSelectorStore =
  createWithEqualityFn<ImageGenModelSelectorStore>()(
    subscribeWithSelector(
      mutative(
        (set): ImageGenModelSelectorStore => ({
          model: "default",
          setModel: async (selectedImageGenModel) => {
            set({ model: selectedImageGenModel });
            await PplxApiService.setDefaultImageGenModel(
              selectedImageGenModel,
              "fetch",
            );
            void persistentQueryClient.queryClient.invalidateQueries({
              queryKey: pplxApiQueries.userSettings.all(),
            });
          },
        }),
      ),
    ),
  );

export const useImageGenModelSelectorStore = imageGenModelSelectorStore;
