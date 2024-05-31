import { useMemo } from 'react';

import { LayoutGrid } from 'lucide-react';
import { PiGlobeX } from 'react-icons/pi';

import { queryBoxStore } from '@/content-script/session-store/query-box';
import { useQuery } from '@tanstack/react-query';

import { Collection } from '../QueryBox/CollectionSelector';
import { webAccessFocus } from '../QueryBox/FocusSelector';
import { languageModels } from '../QueryBox/LanguageModelSelector';

type UseQuickQueryCommanderParamsProps = {
  context: 'main' | 'follow-up';
};

export default function useQuickQueryCommanderParams({
  context,
}: UseQuickQueryCommanderParamsProps) {
  const { data: collections, isFetching: isFetchingCollections } = useQuery<
    Collection[]
  >({
    queryKey: ['collections'],
    initialData: [],
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
              onSelect: () => {
                queryBoxStore.getState().webAccess.toggleWebAccess(false);
              },
            },
            ...webAccessFocus.map((item) => ({
              value: item.code,
              icon: item.icon,
              label: item.label,
              keywords: [item.label] as string[],
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
          optionItems: collections.map((collection) => ({
            value: collection.uuid,
            label: collection.title,
            icon: <LayoutGrid />,
            keywords: [collection.title] as string[],
            onSelect: () => {
              if (context === 'main') {
                return queryBoxStore
                  .getState()
                  .setSelectedCollectionUuid(collection.uuid);
              }

              return console.log('not implemented');
            },
          })),
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
            onSelect: () => {
              queryBoxStore.getState().setSelectedLanguageModel(model.code);
            },
          })),
        },
      ] as const,
    [collections]
  );

  return { quickQueryParams, isFetchingCollections };
}
