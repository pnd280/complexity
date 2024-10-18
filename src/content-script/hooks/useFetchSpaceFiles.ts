import { useQuery } from "@tanstack/react-query";

import PplxApi from "@/services/PplxApi";
import { Space } from "@/types/space.types";

type useFetchSpaceFilesProps = {
  spaceUuid: Space["uuid"];
};

export default function useFetchSpaceFiles({
  spaceUuid,
}: useFetchSpaceFilesProps) {
  const query = useQuery({
    queryKey: ["space-files", spaceUuid],
    queryFn: () => PplxApi.fetchSpaceFiles(spaceUuid),
    refetchOnMount: false,
  });

  return {
    query,
    files: query.data?.files,
  };
}
