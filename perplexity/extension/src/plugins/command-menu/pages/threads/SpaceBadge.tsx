import { Badge } from "@/components/ui/badge";
import { softNavigate } from "@/plugins/_core/main-world/spa-router/utils";
import { commandMenuStore } from "@/plugins/command-menu/store";
import type { ThreadSearchResponseApi } from "@/services/externals/pplx-api/pplx-api.types";
import { emojiCodeToString } from "@/utils/utils";

export default function SpaceBadge({
  space,
}: {
  space: NonNullable<ThreadSearchResponseApi["collection"]>;
}) {
  return (
    <Badge variant="outline" className="x:max-w-[200px] x:cursor-pointer">
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          softNavigate(`/spaces/${space.slug}`);
          commandMenuStore.getState().setOpen(false);
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
