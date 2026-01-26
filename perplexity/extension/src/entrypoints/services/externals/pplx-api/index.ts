import type { Socket } from "socket.io-client";
import { z } from "zod";

import type { ImageModel } from "@/entrypoints/services/externals/cplx-api/remote-resources/pplx-image-models/types";
import { ENDPOINTS } from "@/entrypoints/services/externals/pplx-api/endpoints";
import type {
  Space,
  SpaceFileDownloadUrlApiResponse,
  SpaceFilesApiResponse,
  SpaceThreadsApiResponse,
  ThreadMessageApiResponse,
  ThreadsSearchApiResponse,
  PplxUserSettingsApiResponse,
  SpaceDetails,
  ThreadsSearchPayload,
  PplxAiProfileApiResponse,
  PplxAuthSessionApiResponse,
  PplxOrgSettingsApiResponse,
  ThreadApiResponse,
  PplxRateLimitsApiResponse,
} from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import {
  PplxAiProfileApiResponseSchema,
  PplxOrgSettingsApiResponseSchema,
  PplxRateLimitsApiResponseSchema,
  SpaceDetailsSchema,
  SpaceFileDownloadUrlApiResponseSchema,
  SpaceFilesApiResponseSchema,
  SpacesApiResponseSchema,
  SpaceSchema,
  SpaceThreadsApiResponseSchema,
  ThreadMessageApiResponseSchema,
  ThreadsSearchApiResponseSchema,
} from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import {
  saveUserSettingsViaFetch,
  saveUserSettingsViaWebSocket,
} from "@/entrypoints/services/externals/pplx-api/utils";
import { fetchTextResource, jsonUtils } from "@/utils/misc/utils";

export class PplxApiService {
  static async fetchMaintenanceStatus() {
    return fetchTextResource(ENDPOINTS.MAINTENANCE_STATUS);
  }

  static async fetchAuthSession(): Promise<PplxAuthSessionApiResponse> {
    const resp = await fetchTextResource(ENDPOINTS.AUTH_SESSION);

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch auth session");

    return data;
  }

  static async fetchUserSettings(): Promise<PplxUserSettingsApiResponse> {
    const resp = await fetch(ENDPOINTS.USER_SETTINGS.INDEX);

    const respText = await resp.text();

    if (resp.status === 403 || respText.includes("Just a moment...")) {
      throw new Error("Cloudflare timeout");
    }

    const parsedJson = jsonUtils.safeParse(
      respText,
    ) as PplxUserSettingsApiResponse;

    return parsedJson;
  }

  static async fetchOrgSettings(): Promise<PplxOrgSettingsApiResponse> {
    const resp = await fetchTextResource(ENDPOINTS.USER_SETTINGS.ORG_SETTINGS);

    const data = PplxOrgSettingsApiResponseSchema.parse(
      jsonUtils.safeParse(resp),
    );

    return data;
  }

  private static async saveUserSettings(
    settings: Partial<PplxUserSettingsApiResponse>,
    method: "websocket" | "fetch" = "fetch",
    socketInstance?: Socket,
  ) {
    if (method === "fetch") {
      return saveUserSettingsViaFetch(settings);
    } else {
      invariant(
        socketInstance != null,
        "Please provide a valid socket instance",
      );

      return saveUserSettingsViaWebSocket(settings, socketInstance);
    }
  }

  static async fetchRateLimits(): Promise<PplxRateLimitsApiResponse> {
    const resp = await fetchTextResource(ENDPOINTS.RATE_LIMITS.INDEX);

    return PplxRateLimitsApiResponseSchema.loose().parse(
      jsonUtils.safeParse(resp),
    );
  }

  static async fetchAiProfile(): Promise<PplxAiProfileApiResponse> {
    const resp = await fetchTextResource(ENDPOINTS.AI_PROFILE.INDEX);

    return PplxAiProfileApiResponseSchema.parse(jsonUtils.safeParse(resp));
  }

  static async saveAiProfile(
    profile: Partial<PplxAiProfileApiResponse>,
  ): Promise<boolean> {
    const resp = await fetch(ENDPOINTS.AI_PROFILE.UPDATE, {
      method: "POST",
      body: JSON.stringify({
        action: "save_profile",
        updated_profile: { ...profile, version: "2.18" },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return resp.ok;
  }

  static async toggleAiProfileBio() {
    const resp = await fetch(ENDPOINTS.AI_PROFILE.UPDATE, {
      method: "POST",
      body: JSON.stringify({
        action: "toggle_disabled",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return resp.ok;
  }

  static async setDefaultImageGenModel(
    selectedImageGenModel: ImageModel["code"],
    method: "websocket" | "fetch" = "fetch",
  ) {
    return this.saveUserSettings(
      { default_image_generation_model: selectedImageGenModel },
      method,
    );
  }

  static async fetchThread(
    threadSlug: string,
  ): Promise<ThreadMessageApiResponse[]> {
    if (!threadSlug) throw new Error("Thread slug is required");

    const allEntries: ThreadMessageApiResponse[] = [];
    let hasNextPage = true;
    let cursor: string | undefined;

    while (hasNextPage) {
      const url = ENDPOINTS.RESOURCES.THREADS.GET_ONE({
        slug: threadSlug,
        cursor,
      });

      const resp = await fetchTextResource(url);

      const data = jsonUtils.safeParse(resp) as ThreadApiResponse | null;

      if (data == null) throw new Error("Failed to fetch thread info");

      if (data.entries.length === 0) {
        if (allEntries.length === 0) {
          throw new Error("Thread not found");
        }
        break;
      }

      const parsedEntries = z
        .array(ThreadMessageApiResponseSchema)
        .parse(data.entries);

      allEntries.push(...parsedEntries);

      hasNextPage = data.has_next_page;
      cursor = data.next_cursor ?? undefined;

      if (hasNextPage) {
        await sleep(200);
      }

      console.log(
        "fetching paginated thread, total entries fetched so far:",
        allEntries.length,
      );
    }

    return allEntries;
  }

  static async fetchThreads({
    searchValue = "",
    limit = 20,
    offset = 0,
    ascending,
    querySourceFilter,
    threadTypeFilter,
    withTemporaryThreads,
  }: ThreadsSearchPayload = {}): Promise<ThreadsSearchApiResponse> {
    const resp = await fetch(ENDPOINTS.RESOURCES.THREADS.GET_ALL, {
      method: "POST",
      body: JSON.stringify({
        limit,
        offset,
        search_term: searchValue,
        ascending,
        thread_type_filter: threadTypeFilter,
        query_source_filter: querySourceFilter,
        with_temporary_threads: withTemporaryThreads ? undefined : false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await resp.json();

    return ThreadsSearchApiResponseSchema.parse(data);
  }

  static async fetchSpace(spaceUuid: Space["uuid"]): Promise<SpaceDetails> {
    return SpaceDetailsSchema.parse(
      JSON.parse(
        await fetchTextResource(ENDPOINTS.RESOURCES.SPACES.GET_ONE(spaceUuid)),
      ),
    );
  }

  static async fetchSpaces(): Promise<Space[]> {
    return SpacesApiResponseSchema.parse(
      JSON.parse(await fetchTextResource(ENDPOINTS.RESOURCES.SPACES.GET_ALL)),
    );
  }

  static async fetchSpaceFiles(
    spaceUuid: Space["uuid"],
  ): Promise<SpaceFilesApiResponse> {
    const resp = await fetch(
      "https://www.perplexity.ai/rest/file-repository/list-files?version=2.13&source=default",
      {
        method: "POST",
        body: JSON.stringify({
          file_repository_info: {
            file_repository_type: "COLLECTION",
            owner_id: spaceUuid,
          },
          limit: 12,
          offset: 0,
          search_term: "",
          file_states_in_filter: ["COMPLETE"],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await resp.json();

    const parsedData = SpaceFilesApiResponseSchema.parse(data);

    return parsedData;
  }

  static async fetchSpaceFileDownloadUrl({
    fileS3Url,
  }: {
    fileS3Url: string;
  }): Promise<SpaceFileDownloadUrlApiResponse> {
    // POST https://www.perplexity.ai/rest/file-repository/download-file?version=2.13&source=default
    // payload: {"file_uuid":"a1baad94-9a0a-4c84-925e-b8d41960f428","file_repository_info":{"file_repository_type":"COLLECTION","owner_id":"cf11f61d-4f74-4582-9f2c-365f5419989b"}}

    const resp = await fetch(
      "https://www.perplexity.ai/rest/file-repository/download?version=2.18&source=default",
      {
        method: "POST",
        body: JSON.stringify({
          file_url: fileS3Url,
          view_mode: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await resp.json();

    const parsedData = SpaceFileDownloadUrlApiResponseSchema.parse(data);

    return parsedData;
  }

  static async fetchSpaceThreads({
    spaceSlug,
    limit = 20,
    offset = 0,
  }: {
    spaceSlug: string;
    limit?: number;
    offset?: number;
  }): Promise<SpaceThreadsApiResponse> {
    return SpaceThreadsApiResponseSchema.parse(
      JSON.parse(
        await fetchTextResource(
          ENDPOINTS.RESOURCES.SPACES.GET_THREADS({
            spaceSlug,
            limit,
            offset,
          }),
        ),
      ),
    );
  }

  static async createSpace(
    space: Pick<
      Space,
      "title" | "instructions" | "emoji" | "model_selection" | "description"
    >,
    socketInstance: Socket,
  ): Promise<Space> {
    const resp = await socketInstance.emitWithAck("create_collection", {
      version: "2.15",
      source: "default",
      title: space.title,
      description: space.description,
      emoji: space.emoji,
      instructions: space.instructions,
      access: 1,
      model_selection: space.model_selection,
    });

    return SpaceSchema.parse(resp);
  }

  static async updateSpace(
    spaceUuid: Space["uuid"],
    space: Partial<Space>,
  ): Promise<boolean> {
    const resp = await fetch(
      `https://www.perplexity.ai/rest/collections/edit_collection/${spaceUuid}?version=2.18&source=default`,
      {
        method: "POST",
        body: JSON.stringify(space),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (resp.status !== 200) {
      throw new Error("Failed to update space");
    }

    return true;
  }
}
