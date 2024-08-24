import { CplxVersionsApiResponse } from "@/types/update.types";
import { fetchResource, jsonUtils } from "@/utils/utils";

// TODO: migrate to main repo

export default class CplxApi {
  static async fetchVersions() {
    return jsonUtils.safeParse(
      await fetchResource(
        "https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/versions.json",
      ),
    ) as CplxVersionsApiResponse;
  }

  static async fetchChangelog({ type }: { type: "public" | "internal" }) {
    return await fetchResource(
      `https://raw.githubusercontent.com/pnd280/cplx_release_notes/main/${type}.md`,
    );
  }
}
