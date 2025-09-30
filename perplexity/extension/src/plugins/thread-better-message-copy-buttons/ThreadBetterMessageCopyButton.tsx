import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

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
