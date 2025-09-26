import { lazily } from "react-lazily";

import { CommandItemSkeleton } from "@/components/ui/command";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { CommandPage } from "@/plugins/slash-command/index.public";

const { PromptHistoryCommandMenuContent } = lazily(
  () => import("@/plugins/prompt-history/slash-command/CommandMenuContent"),
);

declare module "@/plugins/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    promptHistory: void;
  }
}

const PromptHistoryPage = memo(() => {
  return (
    <CommandPage pageId="promptHistory">
      <CsUiPluginsGuard
        dependentPluginIds={["slashCommand", "promptHistory"]}
        suspenseFallback={<CommandItemSkeleton count={5} className="x:h-7" />}
      >
        <PromptHistoryCommandMenuContent />
      </CsUiPluginsGuard>
    </CommandPage>
  );
});

export default PromptHistoryPage;
