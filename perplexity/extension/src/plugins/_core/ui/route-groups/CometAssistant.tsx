import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { default: ThreadMessageFooterExtraButtonsWrapper } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-footer/Wrapper"),
);
const { default: ThreadQueryEditButtonGroupExtraButtonsWrapper } = lazily(
  () =>
    import("@/plugins/_core/ui/groups/thread-query-edit-button-group/Wrapper"),
);
const { default: BetterCodeBlocksWrapper } = lazily(
  () => import("@/plugins/thread-better-code-blocks/Wrapper"),
);

export function CometAssistantComponents() {
  return (
    <CsUiPluginsGuard location={["comet_assistant"]}>
      <BetterCodeBlocksWrapper />

      <ThreadQueryEditButtonGroupExtraButtonsWrapper />

      <ThreadMessageFooterExtraButtonsWrapper />
    </CsUiPluginsGuard>
  );
}
