import { Collection } from '@/components/QueryBox/CollectionSelector';
import webpageMessageInterceptors
  from '@/content-script/webpage/message-interceptors';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { LanguageModel } from '@/types/ModelSelector';
import {
  CollectionsAPIResponse,
  ThreadMessageAPIResponse,
  UserProfileSettingsAPIRequest,
  UserProfileSettingsAPIResponse,
  UserSettingsApiResponse,
} from '@/types/PPLXApi';

import {
  fetchResource,
  getPPLXBuildId,
  jsonUtils,
} from './utils';
import { WSMessageParser } from './ws';

async function fetchUserSettings(): Promise<UserSettingsApiResponse> {
  const resp = await fetchResource(
    'https://www.perplexity.ai/p/api/v1/user/settings'
  );

  if (
    resp.startsWith(
      '<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...'
    )
  )
    throw new Error('Cloudflare timeout');

  return jsonUtils.safeParse(resp);
}

async function fetchCollections(): Promise<Collection[]> {
  const pplxBuildId = await getPPLXBuildId();

  if (!pplxBuildId) return [];

  const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/library.json`;
  const jsonData = await fetch(url);

  if (!jsonData.ok) throw new Error('Failed to fetch collections');

  const parsedJson = jsonUtils.safeParse(await jsonData.text());

  const fetchedCollections = parsedJson.pageProps.dehydratedState.queries[1]
    .state.data.pages[0] as CollectionsAPIResponse;

  if (!fetchedCollections?.length) return [];

  const collections: Collection[] = [];

  fetchedCollections.forEach((collection) => {
    collections.push({
      title: collection.title,
      uuid: collection.uuid,
      instructions: collection.instructions,
      url: collection.slug,
      description: collection.description,
      access: collection.access,
    });
  });

  return collections;
}

async function updateCollection(args: {
  collection: Collection;
  newTitle: string;
  newDescription: string;
  newInstructions: string;
}) {
  const { collection, newTitle, newDescription, newInstructions } = args;

  await webpageMessenger.sendMessage({
    event: 'sendWebSocketMessage',
    payload: WSMessageParser.stringify({
      messageCode: 420,
      event: 'edit_collection',
      data: [
        {
          collection_uuid: collection.uuid,
          title: newTitle,
          description: newDescription,
          instructions: newInstructions,
          access: collection.access,
        },
      ],
    }),
    timeout: 5000,
  });
}

async function fetchThreadInfo(threadSlug: string) {
  if (!threadSlug) return null;

  const pplxBuildId = await getPPLXBuildId();

  if (!pplxBuildId) return null;

  const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/search/${threadSlug}.json`;

  const resp = await fetchResource(url);

  const data = jsonUtils.safeParse(resp);

  if (!data) return null;

  return data.pageProps.dehydratedState.queries[1].state
    .data as ThreadMessageAPIResponse[];
}

async function fetchUserProfileSettings(): Promise<UserProfileSettingsAPIResponse | null> {
  const pplxBuildId = await getPPLXBuildId();

  if (!pplxBuildId) return null;

  const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/settings/profile.json`;

  const resp = await fetchResource(url);

  const data = jsonUtils.safeParse(resp);

  if (!data) return null;

  return data.pageProps.profile as UserProfileSettingsAPIResponse;
}

async function setDefaultLanguageModel(
  selectedLanguageModel: LanguageModel['code']
) {
  try {
    await webpageMessenger.sendMessage({
      event: 'sendWebSocketMessage',
      payload: WSMessageParser.stringify({
        messageCode: 423,
        event: 'save_user_settings',
        data: {
          default_model: selectedLanguageModel,
        },
      }),
    });

    return true;
  } catch (e) {
    alert('Failed to change language model');
  }

  return false;
}

async function setDefaultImageModel(selectedImageModel: string) {
  try {
    await webpageMessenger.sendMessage({
      event: 'sendWebSocketMessage',
      payload: WSMessageParser.stringify({
        messageCode: 423,
        event: 'save_user_settings',
        data: {
          default_image_generation_model: selectedImageModel,
        },
      }),
    });

    return true;
  } catch (e) {
    alert('Failed to change image model');
  }

  return false;
}

async function setDefaultProSearch(toggled: boolean) {
  try {
    await webpageMessenger.sendMessage({
      event: 'sendWebSocketMessage',
      payload: WSMessageParser.stringify({
        messageCode: 423,
        event: 'save_user_settings',
        data: {
          default_copilot: toggled,
          is_complexity: true,
        },
      }),
    });

    return true;
  } catch (e) {
    alert('Failed to change pro search state');
  }

  return false;
}

async function updateUserProfileSettings(data: UserProfileSettingsAPIRequest) {
  const data2Send = {
    action:
      typeof data.disabled === 'undefined' ? 'save_profile' : 'toggle_disabled',
    disabled: data.disabled ?? undefined,
    bio: data.bio ?? undefined,
  };

  try {
    await webpageMessenger.sendMessage({
      event: 'sendWebSocketMessage',
      payload: WSMessageParser.stringify({
        messageCode: 421,
        event: 'save_user_ai_profile',
        data: data2Send,
      }),
    });

    await webpageMessageInterceptors.waitForUserProfileSettings();

    return true;
  } catch (e) {
    alert('Failed to update profile settings');
  }

  return false;
}

const pplxApi = {
  fetchCollections,
  fetchUserSettings,
  fetchThreadInfo,
  fetchUserProfileSettings,
  updateCollection,
  updateUserProfileSettings,
  setDefaultLanguageModel,
  setDefaultImageModel,
  setDefaultProSearch,
};

export default pplxApi;
