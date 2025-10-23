import type z from "zod";

import { APP_CONFIG } from "@/app.config";
import {
  ChangelogListingSchema,
  type ChangelogListing,
} from "@/services/externals/cplx-api/types";
import {
  fetchResourceWithSchema,
  getUrl,
} from "@/services/externals/cplx-api/utils";
import { fetchTextResource } from "@/utils/misc/utils";
export const CplxApiOnlineService = {
  fetchChangelog: async ({
    version,
  }: { version?: string } = {}): Promise<string> => {
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
  },

  fetchChangelogListing: async (): Promise<ChangelogListing> => {
    return ChangelogListingSchema.parse(
      JSON.parse(
        await fetchTextResource(
          getUrl({
            path: "/changelogs/listing.json",
          }).toString(),
        ),
      ),
    );
  },

  fetchRemoteResource: async <T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: z.ZodType<T>;
  }): Promise<T> => {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/resources",
    });
  },

  fetchVersionedRemoteResource: async <T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: z.ZodType<T>;
  }): Promise<T> => {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/versioned-resources",
    });
  },

  fetchQueryCacheBuster: async (): Promise<string> => {
    return fetchTextResource(
      getUrl({
        path: "/cache-buster",
      }).toString(),
    );
  },

  fetchPsa: async (): Promise<string> => {
    return fetchTextResource(
      getUrl({
        path: "/assets/psa.md",
      }).toString(),
    );
  },

  fetchCometPatchTutorial: async ({
    platform,
  }: {
    platform?: "mac" | "win";
  }): Promise<string> => {
    return fetchTextResource(
      getUrl({
        path: platform
          ? `/assets/comet-patch-tutorial-${platform}.md`
          : "/assets/comet-patch-tutorial.md",
      }).toString(),
    );
  },
};
