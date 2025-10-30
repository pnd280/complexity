import { useQueryClient } from "@tanstack/react-query";

import Tooltip from "@/components/Tooltip";
import { toast } from "@/components/ui/use-toast";
import type { SpaceFilesApiResponse } from "@/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

import TablerFile from "~icons/tabler/file";

export default function SpaceItemFiles({
  file,
}: {
  file: SpaceFilesApiResponse["files"][number];
}) {
  const queryClient = useQueryClient();

  const displayTitle = file.file_title
    ? `${file.file_title} (${file.filename})`
    : file.filename;

  return (
    <Tooltip content={file.file_description}>
      <div className="x:flex x:items-center x:space-x-2">
        <TablerFile className="x:inline-block x:size-4" />
        <span
          className="x:line-clamp-1 x:cursor-pointer x:hover:underline"
          onClick={async () => {
            const s3Url = file.file_s3_url;
            if (!s3Url) {
              toast({
                description: "Can't get the download URL for this file",
              });
              return;
            }

            const [fileDownloadUrl] = await tryCatch(() =>
              queryClient.fetchQuery(
                pplxApiQueries.space.downloadFile.detail(s3Url),
              ),
            );

            if (fileDownloadUrl?.file_url) {
              window.open(fileDownloadUrl.file_url, "_blank");
            }
          }}
        >
          {displayTitle}
        </span>
      </div>
    </Tooltip>
  );
}
