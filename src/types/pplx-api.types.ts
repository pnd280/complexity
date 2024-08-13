import * as z from "zod";

import { LanguageModel } from "@/content-script/components/QueryBox";
import { Collection } from "@/types/collection.types";
import { UserAiProfile } from "@/types/user-ai-profile";

export type UserSettingsApiResponse = {
  hasAiProfile: boolean;
  defaultCopilot: boolean;
  defaultModel: string;
  defaultImageGenerationModel: string;
  subscriptionStatus: string;
  gpt4Limit: number;
  opusLimit: number;
  createLimit: number;
};

export const UserSettingsApiResponseRawSchema = z.object({
  has_ai_profile: z.boolean(),
  default_copilot: z.boolean().nullable(),
  default_model: z.string(),
  default_image_generation_model: z.string(),
  subscription_status: z.string(),
  gpt4_limit: z.number(),
  opus_limit: z.number(),
  create_limit: z.number(),
});

export type UserSettingsApiResponseRaw = z.infer<
  typeof UserSettingsApiResponseRawSchema
>;

export type CollectionsApiResponse = Collection[];

export type ThreadMessageApiResponse = {
  query_str: string;
  text: string;
  backend_uuid: string;
  author_image: string;
  author_username: string;
  collection_info: Collection;
  thread_url_slug: string;
  display_model: LanguageModel["code"];
};

export type UserAiProfileApiResponse = UserAiProfile;

export type UpdateUserAiProfileApiRequest = Partial<UserAiProfileApiResponse>;
