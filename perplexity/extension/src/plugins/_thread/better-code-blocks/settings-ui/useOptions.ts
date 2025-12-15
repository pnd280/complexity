import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/_thread/better-code-blocks/indexed-db/query-keys";
import { BetterCodeBlocksFineGrainedService } from "@/plugins/_thread/better-code-blocks/indexed-db/service-init.bg-worker";
import { useSettings } from "@/plugins/_thread/better-code-blocks/settings";

type UseOptionsProps = {
  language?: string;
};

export default function useOptions({ language }: UseOptionsProps = {}) {
  const queryClient = useQueryClient();

  const { settings: globalRuleSettings, update: globalRuleUpdate } =
    useSettings();

  const { data: fineGrainedSettings } = useQuery({
    ...betterCodeBlocksFineGrainedOptionsQueries.get.detail(language ?? ""),
    enabled: !!language,
  });

  const fineGrainedUpdate = useMutation({
    mutationKey: ["better-code-blocks-options", "update", language],
    mutationFn: BetterCodeBlocksFineGrainedService.Instance.updateDraft,
    onError: (error) => {
      toast({
        title: "❌ Failed to update options",
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: betterCodeBlocksFineGrainedOptionsQueries.get.detail(
          language ?? "",
        ).queryKey,
      });
    },
  });

  const fineGrainedDelete = useMutation({
    mutationKey: ["better-code-blocks-options", "delete", language],
    mutationFn: async () => {
      if (!language) return;
      await BetterCodeBlocksFineGrainedService.Instance.delete(language);
    },
    onError: (error) => {
      toast({
        title: "❌ Failed to delete options",
        description: error.message,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: betterCodeBlocksFineGrainedOptionsQueries.list.all(),
        exact: true,
      });
    },
  });

  return {
    globalRuleSettings,
    globalRuleUpdate,
    settings: fineGrainedSettings,
    update: fineGrainedUpdate,
    delete: fineGrainedDelete,
  };
}
