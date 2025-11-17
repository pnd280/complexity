import { useQuery } from "@tanstack/react-query";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import type { Space } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import SpaceItemFile from "@/plugins/command-menu/pages/spaces/SpaceItemFile";

import TablerLink from "~icons/tabler/link";

export default function SpacePreview({ space }: { space: Space }) {
  const { data: spaceDetails } = useQuery({
    ...pplxApiQueries.space.detail(space.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: ms("10s"),
  });

  const { data: files } = useQuery({
    ...pplxApiQueries.space.files.detail(space.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: ms("30s"),
  });

  return (
    <div className="x:flex x:flex-col x:gap-4 x:p-4">
      {space.description && (
        <div className="x:flex x:flex-col x:justify-between x:gap-2">
          <div className="x:text-sm x:font-medium x:text-muted-foreground">
            {t("plugin-command-menu.spaces.preview.description")}
          </div>
          <div className="x:line-clamp-3 x:whitespace-pre-wrap">
            {space.description}
          </div>
        </div>
      )}
      {space.instructions && (
        <div className="x:flex x:flex-col x:justify-between x:gap-2">
          <div className="x:text-sm x:font-medium x:text-muted-foreground">
            {t("plugin-command-menu.spaces.preview.instructions")}
          </div>
          <div
            className={cn(
              "custom-scrollbar",
              "x:max-h-60 x:overflow-y-auto x:rounded-md x:bg-secondary x:p-2",
            )}
          >
            <MarkdownRenderer markdown={space.instructions} />
          </div>
        </div>
      )}
      {files && files.num_total_files > 0 && (
        <div className="x:flex x:flex-col x:justify-between x:gap-2">
          <div className="x:text-sm x:font-medium x:text-muted-foreground">
            {t("plugin-command-menu.spaces.preview.files", {
              count: files.num_total_files,
            })}
          </div>
          {files.files.map((file, index) => (
            <SpaceItemFile key={index} file={file} />
          ))}
        </div>
      )}
      {spaceDetails?.focused_web_config &&
        spaceDetails.focused_web_config.link_configs.length > 0 && (
          <div className="x:flex x:flex-col x:justify-between x:gap-2">
            <div className="x:truncate x:text-sm x:font-medium x:text-muted-foreground">
              {t("plugin-command-menu.spaces.preview.webLinks", {
                count: spaceDetails.focused_web_config.link_configs.length,
              })}
            </div>
            <div className="x:flex x:flex-wrap x:items-center x:gap-2">
              {spaceDetails.focused_web_config.link_configs.map((link, idx) => (
                <div key={idx} className="x:flex x:items-center x:gap-2">
                  <TablerLink className="x:size-4" />
                  <div className="x:line-clamp-1 x:underline">{link.link}</div>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
