import { LanguageModel } from "@/content-script/components/QueryBox";
import { Collection } from "@/content-script/components/QueryBox/CollectionSelector";

export type UserSettingsApiResponse = {
  defaultCopilot: boolean;
  defaultImageGenerationModel: string;
  defaultModel: string;
  createLimit: number;
  gpt4Limit: number;
  hasAiProfile: boolean;
  hasLoadedSettings: boolean;
  opusLimit: number;
  stripeStatus: string;
};

export type CollectionsApiResponse = {
  title: string;
  uuid: string;
  instructions: string;
  slug: string;
  description: string;
  access: 1 | 2;
}[];

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

export type UserProfileSettingsApiResponse = {
  profile: {
    has_profile: boolean;
    disabled: boolean;
    bio: string;
  };
  user: {
    subscription_status: "active" | "none";
  };
};

export type UserProfileSettingsApiRequest = Partial<
  UserProfileSettingsApiResponse["profile"]
>;
