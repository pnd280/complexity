import updateService from '@/services/update';
import { compareVersions } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

import packageData from '../../../package.json';

export default function useUpdate({
  forceFetchChangelog,
}: {
  forceFetchChangelog?: boolean;
}) {
  const { data } = useQuery({
    queryKey: ['cplxVersions'],
    queryFn: () => updateService.fetchVersions(),
    refetchOnWindowFocus: false,
  });

  const newVersionAvailable =
    compareVersions(data?.public || '0', packageData.version) === 1;

  const { data: changelog, isLoading: isChangelogFetching } = useQuery({
    queryKey: ['changelog'],
    queryFn: () =>
      updateService.fetchChangelog({
        type: 'public',
      }),
    enabled: newVersionAvailable || !!forceFetchChangelog,
  });

  return {
    newVersionAvailable,
    newVersion: data?.public,
    changelog,
    isChangelogFetching,
  };
}
