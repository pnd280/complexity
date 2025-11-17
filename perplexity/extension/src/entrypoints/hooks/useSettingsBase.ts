import type { QueryClient } from "@tanstack/react-query";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import type { WxtStorageItem } from "@wxt-dev/storage";
import { create, type Draft, type Patch } from "mutative";

import { toast } from "@/components/ui/use-toast";

export const extensionSettingsQueries = {
  all: () => ["settings"],

  settings: {
    all: <const TKey extends string>({ key }: { key: TKey }) =>
      [...extensionSettingsQueries.all(), key] as const,
    details: <
      TValue,
      TMetadata extends Record<string, unknown>,
      const TKey extends string,
    >({
      storage,
      key,
    }: {
      storage: WxtStorageItem<TValue, TMetadata>;
      key: TKey;
    }) =>
      queryOptions({
        queryKey: extensionSettingsQueries.settings.all({ key }),
        queryFn: () => storage.getValue(),
      }),
  },
};

type UseSettingsBaseReturn<TValue> = {
  settings: TValue;
  update: (params: {
    currentSettings?: TValue;
    updateFn: (draft: Draft<NonNullable<TValue>>) => NonNullable<TValue> | void;
  }) => Promise<void>;
};

type UseSettingsBaseOptions<
  TValue,
  TMetadata extends Record<string, unknown>,
> = {
  storage: WxtStorageItem<TValue, TMetadata>;
  validatePatches?: (patches: Patch[]) => void;
  onSettled?: (queryClient: QueryClient) => void;
};

export default function useSettingsBase<
  TValue,
  TMetadata extends Record<string, unknown>,
>({
  storage,
  validatePatches,
  onSettled,
}: UseSettingsBaseOptions<TValue, TMetadata>): UseSettingsBaseReturn<TValue> {
  const queryClient = useQueryClient();

  const queryDetails = extensionSettingsQueries.settings.details({
    storage,
    key: storage.key,
  });

  const { data: settings } = useSuspenseQuery({
    ...queryDetails,
    retry: false,
  });

  const { mutateAsync: update } = useMutation({
    mutationKey: queryDetails.queryKey,
    mutationFn: async ({
      currentSettings,
      updateFn,
    }: Parameters<UseSettingsBaseReturn<TValue>["update"]>[0]) => {
      const draft =
        currentSettings ??
        queryClient.getQueryData(
          extensionSettingsQueries.settings.all({ key: storage.key }),
        );

      invariant(draft != null, `\`${storage.key}\` Current settings not found`);

      const [newSettings, patches] = await create(draft, updateFn, {
        enablePatches: true,
      });

      validatePatches?.(patches);

      return storage.setValue(newSettings);
    },
    onError: (error) => {
      toast({
        description: error.message,
      });
      console.error(error);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: extensionSettingsQueries.settings.all({ key: storage.key }),
      });
      onSettled?.(queryClient);
    },
  });

  return {
    settings,
    update,
  };
}
