import { z } from "zod";

import type { pplxLocalLanguageModels } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";

export const LanguageModelSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string() as z.ZodType<LanguageModelCode>,
  isReasoning: z.boolean(),
  limitKey: z.string().optional(),
  isMax: z.boolean().optional(),
  icon: z.string(),
});

export type LanguageModel = z.infer<typeof LanguageModelSchema>;

export const LanguageModelsListSchema = z.object({
  search: z.array(LanguageModelSchema),
  research: z.array(LanguageModelSchema),
  studio: z.array(LanguageModelSchema),
  study: z.array(LanguageModelSchema),
});

export type LanguageModelsList = z.infer<typeof LanguageModelsListSchema>;

export type LanguageModelType = keyof typeof pplxLocalLanguageModels;

export type LanguageModelCode =
  | (typeof pplxLocalLanguageModels)[LanguageModelType][number]["code"]
  | (string & {});

export type LanguageModelIcon =
  | (typeof pplxLocalLanguageModels)[LanguageModelType][number]["icon"]
  | (string & {});

export type SearchLanguageModelCode =
  (typeof pplxLocalLanguageModels)["search"][number]["code"];

export type ResearchLanguageModelCode =
  (typeof pplxLocalLanguageModels)["research"][number]["code"];

export type LabsLanguageModelCode =
  (typeof pplxLocalLanguageModels)["studio"][number]["code"];

export type StudyLanguageModelCode =
  (typeof pplxLocalLanguageModels)["study"][number]["code"];
