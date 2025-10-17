import type z from "zod";

import type { CplxApiOnlineService } from "@/services/externals/cplx-api/online-service";
import type { ChangelogListing } from "@/services/externals/cplx-api/types";

export const CplxApiOfflineService: typeof CplxApiOnlineService = {
  fetchChangelog: ({
    version: _,
  }: { version?: string } = {}): Promise<string> => {
    return Promise.resolve("");
  },

  fetchChangelogListing: (): Promise<ChangelogListing> => {
    return Promise.resolve({});
  },

  fetchRemoteResource: <T>(_params: {
    resourcePath: string;
    zodSchema: z.ZodType<T>;
  }): Promise<T> => {
    throw new Error("Not available in offline mode");
  },

  fetchVersionedRemoteResource: <T>(_params: {
    resourcePath: string;
    zodSchema: z.ZodType<T>;
  }): Promise<T> => {
    throw new Error("Not available in offline mode");
  },

  fetchSoftCacheBuster: (): Promise<string> => {
    throw new Error("Not available in offline mode");
  },

  fetchPsa: (): Promise<string> => {
    throw new Error("Not available in offline mode");
  },

  fetchCometPatchTutorial: (): Promise<string> => {
    throw new Error("Not available in offline mode");
  },
};
