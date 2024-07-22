import { CPLXVersionsApiResponse } from "@/types/Update";
import { fetchResource, jsonUtils } from "@/utils/utils";

export default class CPLXApi {
  static async fetchVersions() {
    return jsonUtils.safeParse(
      await fetchResource(
        "https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/versions.json",
      ),
    ) as CPLXVersionsApiResponse;
  }

  static async fetchChangelog({ type }: { type: "public" | "internal" }) {
    return await fetchResource(
      `https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/${type}.md`,
    );
  }
}
