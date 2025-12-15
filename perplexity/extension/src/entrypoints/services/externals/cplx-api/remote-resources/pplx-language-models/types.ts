import { z } from "zod";

import type { pplxLocalLanguageModels } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-language-models/defaults";

export const LanguageModelBaseSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string(),
  isReasoning: z.boolean(),
  limitKey: z.string().optional(),
  isMax: z.boolean().optional(),
  icon: z.string(),
});

export type LanguageModelBase = z.infer<typeof LanguageModelBaseSchema>;

export const LanguageModelSchema = LanguageModelBaseSchema.extend({
  code: z.string<LanguageModelCode>(),
});

export type LanguageModel = z.infer<typeof LanguageModelSchema>;

const createLanguageModelsListSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    search: z.array(schema),
    research: z.array(schema),
    studio: z.array(schema),
    study: z.array(schema),
  });

export const LanguageModelsListBaseSchema = createLanguageModelsListSchema(
  LanguageModelBaseSchema,
);

export type LanguageModelsListBase = z.infer<
  typeof LanguageModelsListBaseSchema
>;

export const LanguageModelsListSchema =
  createLanguageModelsListSchema(LanguageModelSchema);

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
