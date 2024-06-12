import { CPLXVersionsAPIResponse } from '@/types/Update';
import {
  fetchResource,
  jsonUtils,
} from '@/utils/utils';

async function fetchVersions() {
  return jsonUtils.safeParse(
    await fetchResource(
      'https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/versions.json'
    )
  ) as CPLXVersionsAPIResponse;
}

async function fetchChangelog({ type }: { type: 'public' | 'internal' }) {
  return await fetchResource(
    `https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/${type}.md`
  );
}

const updateService = {
  fetchVersions,
  fetchChangelog,
};

export default updateService;
