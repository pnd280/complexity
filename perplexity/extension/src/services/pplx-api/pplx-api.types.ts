import { z } from "zod";

import type { LanguageModel } from "@/services/cplx-api/remote-resources/pplx-language-models/types";

export const PplxUserSettingsApiResponseSchema = z.object({
  default_image_generation_model: z.string(),
  subscription_status: z.enum(["active", "trialing", "none"]).optional(),
  gpt4_limit: z.number(),
  create_limit: z.number(),
});

export type PplxUserSettingsApiResponse = z.infer<
  typeof PplxUserSettingsApiResponseSchema
>;

export const PplxOrgSettingsApiResponseSchema = z.object({
  is_in_organization: z.boolean(),
});

export type PplxOrgSettingsApiResponse = z.infer<
  typeof PplxOrgSettingsApiResponseSchema
>;

export const SpaceSchema = z.object({
  title: z.string(),
  uuid: z.string(),
  instructions: z.string(),
  slug: z.string(),
  emoji: z.string().nullable().optional(),
  description: z.string(),
  access: z.number(),
  model_selection: (z.string() as z.ZodType<LanguageModel["code"]>).nullable(),
  enable_web_by_default: z.boolean().nullable(),
  updated_datetime: z.string(),
});

export const SpacesApiResponseSchema = z.array(SpaceSchema);

export type Space = z.infer<typeof SpaceSchema>;

export const SpaceDetailsSchema = SpaceSchema.extend({
  file_count: z.number().nullable(),
  focused_web_config: z
    .object({
      link_configs: z.array(
        z.object({
          link: z.string(),
        }),
      ),
    })
    .nullable(),
});

export type SpaceDetails = z.infer<typeof SpaceDetailsSchema>;

export const SpaceFilesApiResponseSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      file_title: z.string().nullable().optional(),
      file_description: z.string().nullable().optional(),
      file_uuid: z.string(),
      file_s3_url: z.string().nullable(),
      uploaded_by: z.string(),
      file_size: z.number(),
      time_created: z.string(),
      error: z.string().nullable(),
    }),
  ),
  num_total_files: z.number(),
});

export type SpaceFilesApiResponse = z.infer<typeof SpaceFilesApiResponseSchema>;

export const SpaceFileDownloadUrlApiResponseSchema = z.object({
  file_url: z.string(),
});

export type SpaceFileDownloadUrlApiResponse = z.infer<
  typeof SpaceFileDownloadUrlApiResponseSchema
>;

export const ThreadMessageApiResponseSchema = z.object({
  query_str: z.string(),
  text: z.string(),
  backend_uuid: z.string(),
  author_image: z.string().nullable(),
  author_username: z.string().nullable(),
  thread_url_slug: z.string(),
  display_model: z.string() as z.ZodType<LanguageModel["code"]>,
});

export type ThreadMessageApiResponse = z.infer<
  typeof ThreadMessageApiResponseSchema
>;

export const ThreadSearchResponseApiSchema = z.object({
  thread_number: z.number(),
  last_query_datetime: z.string(),
  mode: z.string(),
  context_uuid: z.string(),
  uuid: z.string(),
  slug: z.string(),
  title: z.string(),
  first_answer: z.string(),
  thread_access: z.number(),
  query_count: z.number(),
  search_focus: z.string(),
  read_write_token: z.string(),
  collection: SpaceSchema.pick({
    uuid: true,
    title: true,
    slug: true,
    emoji: true,
  }).optional(),
  has_next_page: z.boolean(),
});

export type ThreadSearchResponseApi = z.infer<
  typeof ThreadSearchResponseApiSchema
>;

export const ThreadsSearchApiResponseSchema = z.array(
  ThreadSearchResponseApiSchema,
);

export type ThreadsSearchApiResponse = z.infer<
  typeof ThreadsSearchApiResponseSchema
>;

export type ThreadsSearchPayload = {
  searchValue?: string;
  limit?: number;
  offset?: number;
  ascending?: boolean;
  threadTypeFilter?: "research" | "labs";
  withTemporaryThreads?: boolean;
  querySourceFilter?: "comet";
};

export const SpaceThreadsApiResponseSchema = ThreadsSearchApiResponseSchema;

export type SpaceThreadsApiResponse = z.infer<
  typeof SpaceThreadsApiResponseSchema
>;

export const PplxAiProfileApiResponseSchema = z.object({
  has_profile: z.boolean(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  language: z.string().nullable(),
  response_language: z.string().nullable(),
  location_lat: z.string().nullable(),
  location_lng: z.string().nullable(),
  disabled: z.boolean(),
});

export type PplxAiProfileApiResponse = z.infer<
  typeof PplxAiProfileApiResponseSchema
>;
