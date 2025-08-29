import { z } from "zod";

import { pplxLocalImageModels } from "@/services/externals/cplx-api/remote-resources/pplx-image-models/defaults";

export const ImageModelSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string() as z.ZodType<ImageModelCode>,
});

export type ImageModel = z.infer<typeof ImageModelSchema>;

export type ImageModelCode =
  | (typeof pplxLocalImageModels)[number]["code"]
  | (string & {});

export function isImageModelCode(value: string): value is ImageModel["code"] {
  return pplxLocalImageModels.some((model) => model.code === value);
}
