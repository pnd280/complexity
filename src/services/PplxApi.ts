import { LanguageModel } from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import {
  OrgSettingsApiResponseSchema,
  SpaceFileDownloadUrlApiResponseSchema,
  SpaceFilesApiResponseSchema,
  ThreadMessageApiResponse,
  UpdateUserAiProfileApiRequest,
  UserSettingsApiResponse,
  UserSettingsApiResponseRawSchema,
} from "@/types/pplx-api.types";
import { Space } from "@/types/space.types";
import { UserAiProfile } from "@/types/user-ai-profile";
import { fetchResource, jsonUtils } from "@/utils/utils";
import WsMessageParser from "@/utils/WsMessageParser";

export default class PplxApi {
  static async fetchAuthSession() {
    const resp = await fetchResource(
      "https://www.perplexity.ai/api/auth/session",
    );

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch auth session");

    return data;
  }

  static async fetchUserSettings(): Promise<UserSettingsApiResponse> {
    // Fallback: https://www.perplexity.ai/rest/user/settings

    const resp = await fetch(
      "https://www.perplexity.ai/p/api/v1/user/settings",
    );

    const respText = await resp.text();

    if (
      resp.status === 403 ||
      respText.startsWith(
        '<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...',
      )
    ) {
      throw new Error("Cloudflare timeout");
    }

    const parsedJson = UserSettingsApiResponseRawSchema.parse(
      jsonUtils.safeParse(respText),
    );

    return {
      hasAiProfile: parsedJson.has_ai_profile,
      defaultCopilot: !!parsedJson.default_copilot,
      defaultModel: parsedJson.default_model,
      defaultImageGenerationModel: parsedJson.default_image_generation_model,
      subscriptionStatus: parsedJson.subscription_status,
      gpt4Limit: parsedJson.gpt4_limit,
      o1Limit: parsedJson.o1_limit,
      opusLimit: parsedJson.opus_limit,
      createLimit: parsedJson.create_limit,
      queryCount: parsedJson.query_count,
    };
  }

  static async fetchSpaces(): Promise<Space[]> {
    // webpageMessenger.sendMessage({
    //   event: "sendWebSocketMessage",
    //   payload: WsMessageParser.stringify({
    //     messageCode: 421,
    //     event: "list_user_collections",
    //     data: {
    //       source: "default",
    //       limit: 50,
    //       offset: 0,
    //     },
    //   }),
    //   forceLongPolling: true,
    // });

    // const spaces = await WebpageMessageInterceptor.waitForSpaces();

    const resp = await fetchResource(
      "https://www.perplexity.ai/rest/collections/list_user_collections?limit=50&offset=0&version=2.13&source=default",
    );

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch spaces");

    return data;
  }

  static async fetchSpaceFiles(spaceUuid: Space["uuid"]) {
    // POST https://www.perplexity.ai/rest/file-repository/list-files?version=2.13&source=default
    // payload: {"file_repository_info":{"file_repository_type":"COLLECTION","owner_id":"cf11f61d-4f74-4582-9f2c-365f5419989b"},"limit":12,"offset":0,"search_term":"","file_states_in_filter":["COMPLETE"]}

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
    fileUuid,
    spaceUuid,
  }: {
    fileUuid: string;
    spaceUuid: string;
  }) {
    // POST https://www.perplexity.ai/rest/file-repository/download-file?version=2.13&source=default
    // payload: {"file_uuid":"a1baad94-9a0a-4c84-925e-b8d41960f428","file_repository_info":{"file_repository_type":"COLLECTION","owner_id":"cf11f61d-4f74-4582-9f2c-365f5419989b"}}

    const resp = await fetch(
      "https://www.perplexity.ai/rest/file-repository/download-file?version=2.13&source=default",
      {
        method: "POST",
        body: JSON.stringify({
          file_uuid: fileUuid,
          file_repository_info: {
            file_repository_type: "COLLECTION",
            owner_id: spaceUuid,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await resp.json();

    const parsedData = SpaceFileDownloadUrlApiResponseSchema.safeParse(data);

    return parsedData;
  }

  static async updateSpace(args: {
    space: Space;
    newTitle: string;
    newDescription: string;
    newInstructions: string;
  }) {
    const { space, newTitle, newDescription, newInstructions } = args;

    await webpageMessenger.sendMessage({
      event: "sendWebSocketMessage",
      payload: WsMessageParser.stringify({
        messageCode: 420,
        event: "edit_space",
        data: [
          {
            space_uuid: space.uuid,
            title: newTitle,
            description: newDescription,
            instructions: newInstructions,
            access: space.access,
          },
        ],
      }),
      timeout: 5000,
    });
  }

  static async fetchThreadInfo(threadSlug: string) {
    if (!threadSlug) throw new Error("Thread slug is required");

    const url = `https://www.perplexity.ai/p/api/v1/thread/${threadSlug}?with_parent_info=true&source=web`;

    const resp = await fetchResource(url);

    const data = jsonUtils.safeParse(resp);

    if (data == null) throw new Error("Failed to fetch thread info");

    if (data.entries == null || data.entries?.length <= 0)
      throw new Error("Thread not found");

    return data.entries as ThreadMessageApiResponse[];
  }

  static async fetchUserAiProfile(): Promise<UserAiProfile> {
    webpageMessenger.sendMessage({
      event: "sendWebSocketMessage",
      payload: WsMessageParser.stringify({
        messageCode: 420,
        event: "get_user_ai_profile",
        data: {
          source: "default",
        },
      }),
      forceLongPolling: true,
    });

    const userAiProfile =
      await WebpageMessageInterceptor.waitForUserAiProfile();

    return userAiProfile;
  }

  static async setDefaultLanguageModel(
    selectedLanguageModel: LanguageModel["code"],
  ) {
    try {
      await webpageMessenger.sendMessage({
        event: "sendWebSocketMessage",
        payload: WsMessageParser.stringify({
          messageCode: 423,
          event: "save_user_settings",
          data: {
            default_model: selectedLanguageModel,
            is_complexity: true,
          },
        }),
        timeout: 5000,
      });

      return true;
    } catch (e) {
      alert("Failed to change language model");
    }

    return false;
  }

  static async setDefaultImageModel(selectedImageModel: string) {
    try {
      await webpageMessenger.sendMessage({
        event: "sendWebSocketMessage",
        payload: WsMessageParser.stringify({
          messageCode: 423,
          event: "save_user_settings",
          data: {
            default_image_generation_model: selectedImageModel,
            is_complexity: true,
          },
        }),
        timeout: 5000,
      });

      return true;
    } catch (e) {
      alert("Failed to change image model");
    }

    return false;
  }

  static async updateUserAiProfile(data: UpdateUserAiProfileApiRequest) {
    const data2Send = {
      action:
        typeof data.disabled === "undefined"
          ? "save_profile"
          : "toggle_disabled",
      disabled: data.disabled ?? undefined,
      bio: data.bio ?? undefined,
    };

    try {
      await webpageMessenger.sendMessage({
        event: "sendWebSocketMessage",
        payload: WsMessageParser.stringify({
          messageCode: 420,
          event: "save_user_ai_profile",
          data: data2Send,
        }),
        timeout: 5000,
      });

      await WebpageMessageInterceptor.waitForUserAiProfile();

      return true;
    } catch (e) {
      console.log(e);
      alert("Failed to update profile settings");
    }

    return false;
  }

  static async fetchOrgSettings() {
    const resp = await fetchResource(
      "https://www.perplexity.ai/rest/enterprise/user/organization?version=2.13&source=default",
    );

    const data = OrgSettingsApiResponseSchema.parse(jsonUtils.safeParse(resp));

    return data;
  }
}
