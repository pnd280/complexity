import type { ZodSchema } from "zod";

import { APP_CONFIG } from "@/app.config";
import {
  ChangelogListingSchema,
  type ChangelogListing,
  type ICplxApiService,
} from "@/services/externals/cplx-api/types";
import {
  fetchResourceWithSchema,
  getUrl,
} from "@/services/externals/cplx-api/utils";
import { fetchTextResource } from "@/utils/utils";
export class CplxApiOnlineService implements ICplxApiService {
  async fetchChangelog({ version }: { version?: string } = {}) {
    const targetVersion = version ?? APP_CONFIG.VERSION;

    const resp = await fetch(
      getUrl({
        path: `/changelogs/${targetVersion}.md`,
        passiveCacheBusterInterval: 1000 * 60 * 30,
      }).toString(),
    );

    if (resp.status === 404) {
      throw new Error(
        `Failed to fetch changelog for version ${targetVersion}.`,
      );
    }

    return resp.text();
  }

  async fetchChangelogListing(): Promise<ChangelogListing> {
    return ChangelogListingSchema.parse(
      JSON.parse(
        await fetchTextResource(
          getUrl({
            path: "/changelogs/listing.json",
          }).toString(),
        ),
      ),
    );
  }

  async fetchRemoteResource<T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/resources",
    });
  }

  async fetchVersionedRemoteResource<T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/versioned-resources",
    });
  }

  async fetchSoftCacheBuster() {
    return fetchTextResource(
      getUrl({
        path: "/cache-buster",
      }).toString(),
    );
  }

  async fetchPsa() {
    return fetchTextResource(
      getUrl({
        path: "/assets/psa.md",
      }).toString(),
    );
  }
}
