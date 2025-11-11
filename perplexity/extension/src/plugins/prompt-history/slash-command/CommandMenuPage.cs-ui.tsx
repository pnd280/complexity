import { Suspense } from "react";
import { lazily } from "react-lazily";

import { CommandItemSkeleton } from "@/components/ui/command";
import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import CommandPage from "@/plugins/__core__/slash-command/components/CommandPage";
import { SlashCommandExternalPage } from "@/plugins/__core__/slash-command/pages/ExternalPages";

const { PromptHistoryCommandMenuContent } = lazily(
  () => import("@/plugins/prompt-history/slash-command/CommandMenuContent"),
);

declare module "@/plugins/__core__/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    promptHistory: void;
  }
}

export default function PromptHistorySlashCommandPageWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["promptHistory"]}>
      <SlashCommandExternalPage>
        <CommandPage pageId="promptHistory">
          <Suspense
            fallback={
              <CommandItemSkeleton
                count={5}
                className="x:h-8 x:bg-muted-foreground/20"
              />
            }
          >
            <PromptHistoryCommandMenuContent />
          </Suspense>
        </CommandPage>
      </SlashCommandExternalPage>
    </CsUiPluginsGuard>
  );
}

PromptHistorySlashCommandPageWrapper.displayName =
  "PromptHistorySlashCommandPageWrapper";
