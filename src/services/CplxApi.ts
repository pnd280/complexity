import { CplxVersionsApiResponse } from "@/types/update.types";
import { fetchResource, jsonUtils } from "@/utils/utils";

export default class CplxApi {
  static async fetchVersions() {
    return jsonUtils.safeParse(
      await fetchResource(
        `https://raw.githubusercontent.com/pnd280/complexity/${import.meta.env.VITE_CHANGELOG_BRANCH ?? "alpha"}/package.json`,
      ),
    ) as CplxVersionsApiResponse;
  }

  static async fetchChangelog() {
    return await fetchResource(
      `https://raw.githubusercontent.com/pnd280/complexity/${import.meta.env.VITE_CHANGELOG_BRANCH ?? "alpha"}/docs/changelog.md`,
    );
  }
}
