import { FaFile } from "react-icons/fa";

import Tooltip from "@/components/Tooltip";
import { queryClient } from "@/data/query-client";
import type {
  Space,
  SpaceFilesApiResponse,
} from "@/services/externals/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/externals/pplx-api/query-keys";

export default function SpaceItemFiles({
  file,
  spaceUuid,
}: {
  file: SpaceFilesApiResponse["files"][number];
  spaceUuid: Space["uuid"];
}) {
  const displayTitle = useMemo(() => {
    if (file.file_title) return `${file.file_title} (${file.filename})`;
    if (!file.file_title) return file.filename;
  }, [file.file_title, file.filename]);

  return (
    <Tooltip content={file.file_description}>
      <div className="x:flex x:items-center x:space-x-2">
        <FaFile className="x:inline-block x:size-4" />
        <span
          className="x:line-clamp-1 x:cursor-pointer x:hover:underline"
          onClick={async () => {
            const fileDownloadUrl = await queryClient.fetchQuery(
              pplxApiQueries.space.files.downloadUrl.detail(
                spaceUuid,
                file.file_uuid,
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
