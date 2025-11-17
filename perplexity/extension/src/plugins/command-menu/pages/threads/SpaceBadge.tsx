import { Badge } from "@/components/ui/badge";
import { softNavigate } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/utils";
import type { ThreadSearchResponseApi } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { commandMenuStore } from "@/plugins/command-menu/store";
import { emojiCodeToString } from "@/utils/misc/utils";

export default function SpaceBadge({
  space,
}: {
  space: NonNullable<ThreadSearchResponseApi["collection"]>;
}) {
  return (
    <Badge
      variant="outline"
      className="x:max-w-[200px] x:cursor-pointer x:rounded-xl"
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void softNavigate(`/spaces/${space.slug}`);
          commandMenuStore.getState().states.setOpen(false);
        }}
      >
        <div className="x:flex x:items-center x:gap-2">
          {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
          <div className="x:line-clamp-1">{space.title}</div>
        </div>
      </div>
    </Badge>
  );
}
