import { Suspense } from "react";
import { lazily } from "react-lazily";

import { CommandItemSkeleton } from "@/components/ui/command";
import CommandPage from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/components/CommandPage";
import { ExternalPageRegister } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/pages/ExternalPages";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { PromptHistoryCommandMenuContent } = lazily(
  () => import("@/plugins/prompt-history/slash-command/CommandMenuContent"),
);

declare module "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store/slices/pages/types" {
  interface SlashCommandPagesArgsRegistry {
    promptHistory: void;
  }
}

function PromptHistorySlashCommandPageWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["promptHistory"]}>
      <ExternalPageRegister id="plugin:promptHistory:slashCommandPage">
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
      </ExternalPageRegister>
    </CsUiGuard>
  );
}

PromptHistorySlashCommandPageWrapper.displayName =
  "PromptHistorySlashCommandPageWrapper";

export default function () {
  csUiMount({
    id: "plugin:promptHistory:slashCommandPage",
    component: <PromptHistorySlashCommandPageWrapper />,
  });
}
