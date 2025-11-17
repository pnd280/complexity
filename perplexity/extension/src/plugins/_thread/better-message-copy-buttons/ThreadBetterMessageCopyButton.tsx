import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import CopyButton from "@/plugins/_thread/better-message-copy-buttons/CopyButton";

export function BetterMessageCopyButton() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const sources = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.webResults,
    deepEqual,
  );

  const hasSources = sources != null && sources.length > 0;

  return (
    <CopyButton messageBlockIndex={messageBlockIndex} hasSources={hasSources} />
  );
}
