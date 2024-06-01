import { useMemo } from 'react';

import {
  Grid2x2X,
  LayoutGrid,
} from 'lucide-react';
import { PiGlobeX } from 'react-icons/pi';

import { queryBoxStore } from '@/content-script/session-store/query-box';
import webpageMessageInterceptors
  from '@/content-script/webpage/message-interceptors';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { ThreadInfoAPIResponse } from '@/types/PPLXApi';
import { WSMessageParser } from '@/utils/ws';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Collection } from '../QueryBox/CollectionSelector';
import { webAccessFocus } from '../QueryBox/FocusSelector';
import { languageModels } from '../QueryBox/LanguageModelSelector';

type UseQuickQueryCommanderParamsProps = {
  context: 'main' | 'follow-up';
};

export default function useQuickQueryCommanderParams({
  context,
}: UseQuickQueryCommanderParamsProps) {
  const queryClient = useQueryClient();

  const { data: collections, isFetching: isFetchingCollections } = useQuery<
    Collection[]
  >({
    queryKey: ['collections'],
    initialData: [],
  });

  const { data: currentThreadInfo, isFetching: isFetchingCurrentThreadInfo } =
    useQuery<ThreadInfoAPIResponse>({
      queryKey: ['currentThreadInfo'],
      enabled: false,
    });

  const quickQueryParams = useMemo(
    () =>
      [
        {
          type: 'focus',
          prefix: '@f',
          heading: 'Web access focus',
          optionItems: [
            {
              value: 'writing',
              icon: <PiGlobeX className="tw-text-[1rem]" />,
              label: 'No web access',
              keywords: ['no web access', 'writing'] as string[],
              hint: '',
              disabled: undefined,
              onSelect: () => {
                queryBoxStore.getState().webAccess.toggleWebAccess(false);
              },
            },
            ...webAccessFocus.map((item) => ({
              value: item.code,
              icon: item.icon,
              label: item.label,
              keywords: [item.label] as string[],
              hint: '',
              disabled: undefined,
              onSelect: () => {
                queryBoxStore.getState().webAccess.toggleWebAccess(true);
                queryBoxStore.getState().webAccess.setFocus(item.code);
              },
            })),
          ],
        },
        {
          type: 'collections',
          prefix: '@c',
          heading: context === 'main' ? 'Collections' : 'Swap to Collection',
          optionItems: [
            ...collections.map((collection) => ({
              value: collection.uuid,
              label: collection.title,
              icon: <LayoutGrid />,
              keywords: [collection.title] as string[],
              hint: (collection.description || collection.instructions).slice(
                0,
                100
              ),
              disabled:
                currentThreadInfo?.collection_info?.uuid === collection.uuid,
              onSelect: async () => {
                if (context === 'main') {
                  return queryBoxStore
                    .getState()
                    .setSelectedCollectionUuid(collection.uuid);
                }

                if (isFetchingCurrentThreadInfo) {
                  return;
                }

                webpageMessenger.sendMessage({
                  event: 'sendWebsocketMessage',
                  payload: WSMessageParser.stringify({
                    messageCode: 421,
                    event: 'upsert_thread_collection',
                    data: {
                      entry_uuid: currentThreadInfo?.backend_uuid,
                      new_collection_uuid: collection.uuid,
                      source: 'default',
                    },
                  }),
                });

                await webpageMessageInterceptors.waitForUpsertThreadCollection();

                setTimeout(() => {
                  webpageMessenger.sendMessage({
                    event: 'routeToPage',
                    payload: {
                      url: `/search/${currentThreadInfo?.thread_url_slug}`,
                      scroll: false,
                    },
                  });
                  queryClient.invalidateQueries({
                    queryKey: ['currentThreadInfo'],
                  });
                }, 500);
              },
            })),
            {
              value: 'Default',
              label: 'Default ',
              icon: <Grid2x2X />,
              keywords: ['default', 'remove'],
              hint:
                context === 'follow-up' ? 'remove from current collection' : '',
              disabled:
                currentThreadInfo && !currentThreadInfo.collection_info,
              onSelect: async () => {
                if (context === 'main') {
                  return queryBoxStore.getState().setSelectedCollectionUuid('');
                }

                if (isFetchingCurrentThreadInfo) {
                  return;
                }

                webpageMessenger.sendMessage({
                  event: 'sendWebsocketMessage',
                  payload: WSMessageParser.stringify({
                    messageCode: 421,
                    event: 'remove_collection_thread',
                    data: {
                      entry_uuid: currentThreadInfo?.backend_uuid,
                      collection_uuid: currentThreadInfo?.collection_info.uuid,
                      source: 'default',
                    },
                  }),
                });

                await webpageMessageInterceptors.waitForUpsertThreadCollection();

                setTimeout(() => {
                  webpageMessenger.sendMessage({
                    event: 'routeToPage',
                    payload: {
                      url: `/search/${currentThreadInfo?.thread_url_slug}`,
                      scroll: false,
                    },
                  });
                  queryClient.invalidateQueries({
                    queryKey: ['currentThreadInfo'],
                  });
                }, 500);
              },
            },
          ],
        },
        {
          type: 'languageModels',
          prefix: '@t',
          heading: 'Language Models',
          optionItems: languageModels.map((model) => ({
            value: model.code,
            icon: <div className="tw-text-[1rem]">{model.icon}</div>,
            label: model.label,
            keywords: [model.label] as string[],
            hint: '',
            disabled: undefined,
            onSelect: () => {
              queryBoxStore.getState().setSelectedLanguageModel(model.code);
            },
          })),
        },
      ] as const,
    [collections, currentThreadInfo]
  );

  return { quickQueryParams, isFetchingCollections };
}
