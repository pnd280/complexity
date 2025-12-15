import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useThreadMessageBlocksDomObserverStore } from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-index-context";
import { PluginsSettingSnapshotsService } from "@/entrypoints/services/plugins/settings/snapshots";

import TablerInfoCircle from "~icons/tabler/info-circle";

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
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="x:flex x:h-full x:cursor-pointer x:items-center x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground">
          <TablerInfoCircle className="x:size-4" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="x:grid x:grid-cols-2 x:gap-x-3 x:gap-y-1 x:text-sm">
          <div className="x:text-muted-foreground">
            {t("common.misc.words")}
          </div>
          <div className="x:text-right">{wordCount}</div>

          <div className="x:text-muted-foreground">
            {t("common.misc.characters")}
          </div>
          <div className="x:text-right">{characterCount}</div>

          {settings.showTokens && (
            <>
              <div className="x:text-muted-foreground">tokens</div>
              <div className="x:text-right">~{tokenCount}</div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
