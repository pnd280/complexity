import { Collection } from '@/components/QueryBox/CollectionSelector';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import {
  CollectionsAPIResponse,
  ThreadInfoAPIResponse,
  UserSettingsApiResponse,
} from '@/types/PPLXApi';

import {
  fetchResource,
  getPPLXBuildId,
  jsonUtils,
  sleep,
} from './utils';
import { WSMessageParser } from './ws';

async function fetchUserSettings(): Promise<UserSettingsApiResponse> {
  const resp = await fetchResource(
    'https://www.perplexity.ai/p/api/v1/user/settings'
  );

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
    event: 'sendWebsocketMessage',
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

  return data.pageProps.dehydratedState.queries[1].state.data[0] as ThreadInfoAPIResponse;
}

const pplxApi = {
  fetchCollections,
  fetchUserSettings,
  updateCollection,
  fetchThreadInfo,
};

export default pplxApi;
