import { Portal } from "@/components/ui/portal";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { ThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import { useCreatePortalContainers } from "@/plugins/_core/ui/groups/thread-message-footer/useCreatePortalContainers";
import ThreadBetterMessageCopyButtonWrapper from "@/plugins/thread-better-message-copy-buttons/Wrapper";
import ThreadBetterRewriteDropdownWrapper from "@/plugins/thread-better-rewrite-dropdown/Wrapper";
import ThreadMessageMetricsWrapper from "@/plugins/thread-message-length/MessageWrapper";
import ThreadMessageTtsButtonWrapper from "@/plugins/thread-message-tts/Wrapper";

declare module "@/plugins/_core/ui/groups/types" {
  interface UiGroupRegistry {
    "thread:messageBlocks:footer": void;
  }
}

export function ThreadMessageFooterExtraButtons() {
  const portalContainers = useCreatePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <ThreadMessageContext value={{ messageBlockIndex: index }}>
        <MemoizedWrapper />
      </ThreadMessageContext>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <ThreadMessageMetricsWrapper />

      <ThreadMessageTtsButtonWrapper />

      <CsUiPluginsGuard excludeLocation={["comet_assistant"]}>
        <ThreadBetterRewriteDropdownWrapper />
      </CsUiPluginsGuard>

      <ThreadBetterMessageCopyButtonWrapper />
    </div>
  );
});
