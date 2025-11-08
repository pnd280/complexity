import { lazily } from "react-lazily";

import { CommandItemSkeleton } from "@/components/ui/command";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import CommandPage from "@/plugins/__core__/slash-command/components/CommandPage";
import { SlashCommandExternalPage } from "@/plugins/__core__/slash-command/pages/registries";

const { PromptHistoryCommandMenuContent } = lazily(
  () => import("@/plugins/prompt-history/slash-command/CommandMenuContent"),
);

declare module "@/plugins/__core__/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    promptHistory: void;
  }
}

const PromptHistoryPage = withPluginsGuard(
  memo(() => (
    <CommandPage pageId="promptHistory">
      <PromptHistoryCommandMenuContent />
    </CommandPage>
  )),
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

const PromptHistorySlashCommandPageWrapper = () => (
  <SlashCommandExternalPage>
    <PromptHistoryPage />
  </SlashCommandExternalPage>
);

PromptHistorySlashCommandPageWrapper.displayName =
  "PromptHistorySlashCommandPageWrapper";

export default PromptHistorySlashCommandPageWrapper;
