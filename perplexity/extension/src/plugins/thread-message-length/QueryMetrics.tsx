import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import { ExtensionSettingsService } from "@/services/infra/extension-settings";

export function QueryMetrics() {
  const { messageBlockIndex } = useThreadMessageContext();

  const title = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.title,
    deepEqual,
  );

  const metrics = useMemo(() => {
    if (!title) return null;
    const wordCount = title.split(" ").length;
    const characterCount = title.length;
    const tokenCount = Math.ceil(characterCount / 4);
    return { wordCount, characterCount, tokenCount };
  }, [title]);

  const settings = ExtensionSettingsService.cachedSync;

  if (!metrics) return null;
  const { wordCount, characterCount, tokenCount } = metrics;

  return (
    <div className="x:flex x:h-full x:items-center x:px-2 x:text-xs x:text-muted-foreground">
      {wordCount} {t("common.misc.words")} | {characterCount}{" "}
      {t("common.misc.characters")}
      {settings.plugins["thread:showMessageLength"].showTokens
        ? ` | ${tokenCount} tokens`
        : ""}
    </div>
  );
}
