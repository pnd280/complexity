import { LanguageModel } from "@/content-script/components/QueryBox";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import { Collection } from "@/types/collection.types";
import {
  ThreadMessageApiResponse,
  UpdateUserAiProfileApiRequest,
  UserSettingsApiResponse,
  UserSettingsApiResponseRawSchema,
} from "@/types/pplx-api.types";
import { UserAiProfile } from "@/types/user-ai-profile";
import { fetchResource, jsonUtils } from "@/utils/utils";
import WsMessageParser from "@/utils/WsMessageParser";

export default class PplxApi {
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

  static async fetchCollections(): Promise<Collection[]> {
    webpageMessenger.sendMessage({
      event: "sendWebSocketMessage",
      payload: WsMessageParser.stringify({
        messageCode: 421,
        event: "list_user_collections",
        data: {
          source: "default",
          limit: 50,
          offset: 0,
        },
      }),
      forceLongPolling: true,
    });

    const collections = await WebpageMessageInterceptor.waitForCollections();

    return collections;
  }

  static async updateCollection(args: {
    collection: Collection;
    newTitle: string;
    newDescription: string;
    newInstructions: string;
  }) {
    const { collection, newTitle, newDescription, newInstructions } = args;

    await webpageMessenger.sendMessage({
      event: "sendWebSocketMessage",
      payload: WsMessageParser.stringify({
        messageCode: 420,
        event: "edit_collection",
        data: [
          {
            collection_uuid: collection.uuid,
            title: newTitle,
            description: newDescription,
            instructions: newInstructions,
            access: collection.access,
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
}
