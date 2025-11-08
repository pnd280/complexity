import { Highlight } from "@ark-ui/react/highlight";
import { isHotkeyPressed } from "react-hotkeys-hook";

import ClockTemporary from "@/components/icons/ClockTemporary";
import { Badge } from "@/components/ui/badge";
import {
  CommandItem,
  CommandItemRightAttributes,
  CommandItemTitle,
} from "@/components/ui/command";
import {
  openInNewTab,
  softNavigate,
  useSpaRouter,
} from "@/plugins/__core__/_main-world/spa-router/utils";
import { useCurrentPage } from "@/plugins/command-menu/hooks/useCurrentPage";
import SpaceBadge from "@/plugins/command-menu/pages/threads/SpaceBadge";
import { commandMenuStore } from "@/plugins/command-menu/store";
import type { ThreadSearchResponseApi } from "@/services/externals/pplx-api/pplx-api.types";
import { formatExactDate, formatRelativeTime } from "@/services/infra/i18n";
import { jsonUtils } from "@/utils/misc/utils";

type ThreadItemProps = {
  thread: ThreadSearchResponseApi;
  searchValue: string;
};

const ThreadItem = memo(({ thread, searchValue }: ThreadItemProps) => {
  const url = useSpaRouter((store) => store.url);

  const currentPage = useCurrentPage();

  const isSpaceThreadsPage = currentPage?.pageId === "spaceThreads";

  const firstAnswer: string = (() => {
    const content = jsonUtils.safeParse(thread.first_answer)?.answer as
      | string
      | null;
    return content?.slice(0, 1000) ?? "";
  })();

  const keywords = isSpaceThreadsPage
    ? thread.title.split(" ")
    : [...thread.title.split(" "), firstAnswer];

  return (
    <a
      key={thread.uuid}
      href={`/search/${thread.slug}`}
      aria-label={thread.title}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <CommandItem
        value={thread.uuid}
        keywords={keywords}
        className="x:flex-col x:items-start x:justify-center x:gap-2"
        onSelect={() => {
          if (isHotkeyPressed(Key.Alt)) {
            void openInNewTab(`/search/${thread.slug}`);
          } else {
            void softNavigate(`/search/${thread.slug}`);
          }

          commandMenuStore.getState().states.setOpen(false);
        }}
      >
        <CommandItemTitle className="x:flex x:w-full x:items-start x:justify-center">
          <div className="x:flex x:min-w-0 x:flex-1 x:items-center x:gap-4">
            <div className="x:truncate x:text-sm">
              <Highlight
                ignoreCase
                matchAll
                query={searchValue.split(" ")}
                text={thread.title.slice(0, 500)}
              />
            </div>
            {url.includes(thread.slug) && (
              <Badge variant="outline">
                {t("plugin-command-menu.common.current")}
              </Badge>
            )}
          </div>
          <CommandItemRightAttributes className="x:ml-2 x:flex x:shrink-0 x:flex-col x:items-end x:justify-center x:gap-2 x:text-xs x:text-nowrap x:text-muted-foreground">
            <div>{formatRelativeTime(thread.last_query_datetime)}</div>
          </CommandItemRightAttributes>
        </CommandItemTitle>
        <div className="x:line-clamp-2 x:text-xs x:text-muted-foreground">
          <Highlight
            ignoreCase
            matchAll
            query={searchValue.split(" ")}
            text={firstAnswer}
          />
        </div>
        <div className="x:flex x:w-full x:items-center x:gap-2">
          {thread.expiry_time && (
            <div className="x:mt-2 x:flex x:items-center x:gap-4">
              <div className="x:flex x:items-center x:gap-1 x:rounded-xl x:border x:border-dashed x:border-border/50 x:px-2 x:py-1 x:text-xs x:text-muted-foreground">
                <ClockTemporary />
                <span>Temporary Thread</span>
              </div>
              <div className="x:text-xs x:text-muted-foreground">
                {t("plugin-command-menu.common.expires", {
                  date: formatExactDate(thread.expiry_time),
                })}
              </div>
            </div>
          )}
          {!isSpaceThreadsPage && thread.collection && (
            <div className="x:ml-auto">
              <SpaceBadge space={thread.collection} />
            </div>
          )}
        </div>
      </CommandItem>
    </a>
  );
});

export default ThreadItem;
