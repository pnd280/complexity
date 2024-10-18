import * as z from "zod";

import { languageModels } from "@/content-script/components/QueryBox/consts";

export const SpaceSchema = z.object({
  title: z.string(),
  uuid: z.string(),
  instructions: z.string(),
  slug: z.string(),
  emoji: z.string().nullable().optional(),
  description: z.string(),
  access: z.literal(1).or(z.literal(2)),
  model_selection: z.string().nullable(),
});

export type Space = z.infer<typeof SpaceSchema> & {
  model_selection: (typeof languageModels)[number]["code"] | null;
};
