import { LuInfo } from "react-icons/lu";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadMessageIndexContext } from "@/plugins/_core/ui/groups/thread-message-index-context";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export function MessageMetrics() {
  const messageBlockIndex = useThreadMessageIndexContext();

  const answer = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.answer,
    deepEqual,
  );

  const settings = ExtensionSettingsService.cachedSync;

  const metrics = useMemo(() => {
    if (!answer) return null;
    const wordCount = answer.split(" ").length;
    const characterCount = answer.length;
    const tokenCount = settings.plugins["thread:showMessageLength"].showTokens
      ? Math.ceil(characterCount / 4)
      : null;
    return { wordCount, characterCount, tokenCount };
  }, [settings, answer]);

  return (
    <HoverCard
      portal
      positioning={{ placement: "top-end" }}
      openDelay={0}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <div
          className="x:cursor-pointer x:rounded-full x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
          tabIndex={0}
        >
          <LuInfo className="x:size-4" />
        </div>
      </HoverCardTrigger>
      {metrics && (
        <HoverCardContent>
          <div className="x:my-1 x:grid x:grid-cols-2 x:gap-x-3 x:gap-y-1">
            <div className="x:text-muted-foreground">
              {t("common.misc.words")}
            </div>
            <div className="x:text-right">{metrics.wordCount}</div>

            <div className="x:text-muted-foreground">
              {t("common.misc.characters")}
            </div>
            <div className="x:text-right">{metrics.characterCount}</div>

            {settings.plugins["thread:showMessageLength"].showTokens &&
              metrics.tokenCount != null && (
                <>
                  <div className="x:text-muted-foreground">tokens:</div>
                  <div className="x:text-right">{metrics.tokenCount}</div>
                </>
              )}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
