import { CplxVersionsApiResponse } from "@/types/update.types";
import { fetchResource, jsonUtils } from "@/utils/utils";

// TODO: migrate to main repo

export default class CplxApi {
  static async fetchVersions() {
    return jsonUtils.safeParse(
      await fetchResource(
        "https://raw.githubusercontent.com/pnd280/complexity/chrome-ext/package.json",
      ),
    ) as CplxVersionsApiResponse;
  }

  static async fetchChangelog() {
    return await fetchResource(
      "https://raw.githubusercontent.com/pnd280/complexity/chrome-ext/docs/changelog.md",
    );
  }
}
