import { Collection } from '@/components/QueryBox/CollectionSelector';

import { LanguageModel } from './ModelSelector';

export type UserSettingsApiResponse = {
  create_limit: number;
  default_copilot: boolean;
  default_image_generation_model: string;
  default_model: string;
  disable_training: boolean;
  gpt4_limit: number;
  has_ai_profile: boolean;
  opus_limit: number;
  query_count: number;
  query_count_copilot: number;
  subscription_status: string;
  upload_limit: number;
};

export type CollectionsAPIResponse = {
  title: string;
  uuid: string;
  instructions: string;
  slug: string;
  description: string;
  access: 1 | 2;
}[];

export type ThreadMessageAPIResponse = {
  query_str: string;
  text: string;
  backend_uuid: string;
  author_image: string;
  author_username: string;
  collection_info: Collection;
  thread_url_slug: string;
  display_model: LanguageModel['code'];
};

export type UserProfileSettingsAPIResponse = {
  has_profile: boolean;
  disabled: boolean;
  bio: string;
};

export type UserProfileSettingsAPIRequest =
  Partial<UserProfileSettingsAPIResponse>;
