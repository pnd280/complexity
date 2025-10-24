import { useThreadMessageBlocksDomObserverStore } from "@/plugins/__core__/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/__ui-groups__/elements/thread-message-index-context";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export function QueryMetrics() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const title = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.title,
    deepEqual,
  );

  const metrics = title
    ? (() => {
        const wordCount = title.split(" ").length;
        const characterCount = title.length;
        const tokenCount = Math.ceil(characterCount / 4);
        return { wordCount, characterCount, tokenCount };
      })()
    : null;

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
