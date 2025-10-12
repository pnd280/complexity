import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { type ImageModel } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { PplxApiService } from "@/services/externals/pplx-api";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";
import { queryClient } from "@/services/infra/query-client";

type ImageGenModelSelectorStore = {
  model: ImageModel["code"];
  setModel: (selectedImageGenModel: ImageModel["code"]) => void;
};

export const imageGenModelSelectorStore =
  createWithEqualityFn<ImageGenModelSelectorStore>()(
    subscribeWithSelector(
      immer(
        (set): ImageGenModelSelectorStore => ({
          model: "default",
          setModel: async (selectedImageGenModel) => {
            set({ model: selectedImageGenModel });
            await PplxApiService.setDefaultImageGenModel(
              selectedImageGenModel,
              "fetch",
            );
            void queryClient.invalidateQueries({
              queryKey: pplxApiQueries.userSettings.all(),
            });
          },
        }),
      ),
    ),
  );

export const useImageGenModelSelectorStore = imageGenModelSelectorStore;
