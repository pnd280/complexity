import { isHotkeyPressed } from "react-hotkeys-hook";

import PplxSpace from "@/components/icons/PplxSpace";
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
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";
import type { Space } from "@/services/externals/pplx-api/pplx-api.types";
import { formatRelativeTime } from "@/services/infra/i18n";
import { emojiCodeToString } from "@/utils/misc/utils";

export default function SpaceCommandItem({ space }: { space: Space }) {
  const url = useSpaRouter((state) => state.url);

  const sidecarOpen = useCommandMenuStore((store) => store.sidecarOpen);

  return (
    <a
      key={space.uuid}
      href={`/spaces/${space.slug}`}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <CommandItem
        value={space.uuid}
        keywords={space.title.split(" ")}
        className="x:flex-col x:items-start x:justify-center x:gap-2"
        onSelect={() => {
          if (isHotkeyPressed(Key.Alt)) {
            void openInNewTab(`/spaces/${space.slug}`);
            commandMenuStore.getState().setOpen(false);
          } else if (isHotkeyPressed(Key.Shift)) {
            commandMenuStore.getState().pushPage({
              pageId: "spaceThreads",
              args: {
                spaceSlug: space.slug,
              },
              searchPlaceholder: t(
                "plugin-command-menu.spaces.footer.searchSpacePlaceholder",
                { spaceName: space.title },
              ),
              shouldLocalFilter: true,
              sidecarOpen: false,
            });
          } else {
            void softNavigate(`/spaces/${space.slug}`);
            commandMenuStore.getState().setOpen(false);
          }
        }}
      >
        <CommandItemTitle className="x:flex x:w-full x:items-center x:justify-center">
          <div className="x:flex x:min-w-0 x:flex-1 x:items-center x:gap-4">
            <div className="x:flex x:items-center x:gap-2">
              {space.emoji ? (
                <div>{emojiCodeToString(space.emoji)}</div>
              ) : (
                <PplxSpace />
              )}
              <div className="x:line-clamp-1">{space.title}</div>
            </div>
            {url.includes(space.slug) && (
              <Badge variant="outline">
                {t("plugin-command-menu.navigation.current")}
              </Badge>
            )}
          </div>
          <CommandItemRightAttributes className="x:ml-2 x:shrink-0 x:text-xs x:text-nowrap x:text-muted-foreground">
            {formatRelativeTime(space.updated_datetime)}
          </CommandItemRightAttributes>
        </CommandItemTitle>
        {!sidecarOpen && space.description && (
          <div className="x:line-clamp-2 x:text-xs x:text-muted-foreground">
            {space.description}
          </div>
        )}
      </CommandItem>
    </a>
  );
}
