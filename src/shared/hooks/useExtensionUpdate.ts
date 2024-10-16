import { useQuery } from "@tanstack/react-query";

import appConfig from "@/app.config";
import CplxApi from "@/services/CplxApi";
import { compareVersions } from "@/utils/utils";
import packageData from "~/package.json";

export default function useExtensionUpdate({
  forceFetchChangelog,
}: {
  forceFetchChangelog?: boolean;
}) {
  const { data } = useQuery({
    queryKey: ["cplxVersions"],
    queryFn: () => CplxApi.fetchVersions(),
    refetchOnWindowFocus: false,
  });

  const newVersionAvailable =
    data &&
    compareVersions(
      data?.[appConfig.BROWSER] || "0.0.0.0",
      packageData.version,
    ) === 1;

  const { data: changelog, isLoading: isChangelogFetching } = useQuery({
    queryKey: ["changelog"],
    queryFn: CplxApi.fetchChangelog,
    enabled: newVersionAvailable || forceFetchChangelog,
  });

  return {
    newVersionAvailable,
    newVersion: data?.[appConfig.BROWSER],
    changelog,
    isChangelogFetching,
  };
}
