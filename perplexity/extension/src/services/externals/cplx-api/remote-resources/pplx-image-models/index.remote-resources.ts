import { z } from "zod";

import { defineRemoteResource } from "@/services/externals/cplx-api/remote-resources";
import { pplxLocalImageModels } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/defaults";
import {
  ImageModelSchema,
  type ImageModel,
} from "@/services/externals/cplx-api/remote-resources/pplx-image-models/types";

export const pplxImageModelsResourceConfig = defineRemoteResource({
  resourcePath: "image-models.json",
  type: "json",
  fallback: pplxLocalImageModels as unknown as ImageModel[],
  zodSchema: z.array(ImageModelSchema),
});
