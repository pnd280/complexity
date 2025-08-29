import type { ZodSchema } from "zod";

import type {
  ChangelogListing,
  ICplxApiService,
} from "@/services/externals/cplx-api/types";

export class CplxApiOfflineService implements ICplxApiService {
  fetchChangelog({ version: _ }: { version?: string } = {}): Promise<string> {
    return Promise.resolve("");
  }

  fetchChangelogListing(): Promise<ChangelogListing> {
    return Promise.resolve({});
  }

  async fetchRemoteResource<T>(_params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    throw new Error("Not available in offline mode");
  }

  async fetchVersionedRemoteResource<T>(_params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    throw new Error("Not available in offline mode");
  }

  async fetchSoftCacheBuster(): Promise<string> {
    throw new Error("Not available in offline mode");
  }

  async fetchPsa(): Promise<string> {
    throw new Error("Not available in offline mode");
  }
}
