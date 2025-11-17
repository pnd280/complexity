import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";

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

  const settings = PluginsSettingSnapshotsService.getPluginSnapshot(
    "thread:messageMetrics",
  );

  if (!metrics) return null;
  const { wordCount, characterCount, tokenCount } = metrics;

  return (
    <div className="x:flex x:h-full x:items-center x:px-2 x:text-xs x:text-muted-foreground">
      {wordCount} {t("common.misc.words")} | {characterCount}{" "}
      {t("common.misc.characters")}
      {settings.showTokens ? ` | ${tokenCount} tokens` : ""}
    </div>
  );
}
