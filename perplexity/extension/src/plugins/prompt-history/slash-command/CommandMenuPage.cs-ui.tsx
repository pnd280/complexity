import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { CommandItemSkeleton } from "@/components/ui/command";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import CommandPage from "@/plugins/__core__/slash-command/components/CommandPage";

const { PromptHistoryCommandMenuContent } = lazily(
  () => import("@/plugins/prompt-history/slash-command/CommandMenuContent"),
);

declare module "@/plugins/__core__/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    promptHistory: void;
  }
}

export const PromptHistoryPage = withPluginsGuard(
  memo(() => {
    return (
      <CommandPage pageId="promptHistory">
        <PromptHistoryCommandMenuContent />
      </CommandPage>
    );
  }),
  {
    dependentPluginIds: ["promptHistory"],
    suspenseFallback: (
      <CommandItemSkeleton
        count={5}
        className="x:h-8 x:bg-muted-foreground/20"
      />
    ),
  },
);

export const uiGroup: UiGroupId = "slashCommandMenu:pages";

export default PromptHistoryPage;
