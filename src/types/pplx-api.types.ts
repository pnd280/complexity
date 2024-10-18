import * as z from "zod";

import { LanguageModel } from "@/content-script/components/QueryBox";
import { Space } from "@/types/space.types";
import { HasUserAiProfile, UserAiProfile } from "@/types/user-ai-profile";

export type SubscriptionStatus = "active" | "trialing" | "none";

export type UserSettingsApiResponse = {
  hasAiProfile: boolean;
  defaultCopilot: boolean;
  defaultModel: string;
  defaultImageGenerationModel: string;
  subscriptionStatus?: SubscriptionStatus;
  gpt4Limit: number;
  opusLimit: number;
  o1Limit: number;
  createLimit: number;
  queryCount: number;
};

export const UserSettingsApiResponseRawSchema = z.object({
  has_ai_profile: z.boolean(),
  default_copilot: z.boolean().nullable(),
  default_model: z.string(),
  default_image_generation_model: z.string(),
  subscription_status: z.enum(["active", "trialing", "none"]).optional(),
  gpt4_limit: z.number(),
  opus_limit: z.number(),
  o1_limit: z.number(),
  create_limit: z.number(),
  query_count: z.number(),
});

export type UserSettingsApiResponseRaw = z.infer<
  typeof UserSettingsApiResponseRawSchema
>;

export type SpacesApiResponse = Space[];

export type ThreadMessageApiResponse = {
  query_str: string;
  text: string;
  backend_uuid: string;
  author_image: string | null;
  author_username: string;
  space_info: Space;
  thread_url_slug: string;
  display_model: LanguageModel["code"];
};

export type UserAiProfileApiResponse = UserAiProfile;

export type UpdateUserAiProfileApiRequest = Partial<HasUserAiProfile>;

export const SpaceFilesApiResponseSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      file_uuid: z.string(),
      file_s3_url: z.string(),
      uploaded_by: z.string(),
      file_size: z.number(),
      time_created: z.string(),
      error: z.string().nullable(),
    }),
  ),
  num_total_files: z.number(),
});

export type SpaceFilesApiResponse = z.infer<typeof SpaceFilesApiResponseSchema>;
