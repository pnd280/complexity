import { LanguageModel } from "@/content-script/components/QueryBox";
import { Collection } from "@/content-script/components/QueryBox/CollectionSelector";
import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import {
  CollectionsApiResponse,
  ThreadMessageApiResponse,
  UserProfileSettingsApiRequest,
  UserProfileSettingsApiResponse,
  UserSettingsApiResponse,
} from "@/types/pplx-api.types";
import { fetchResource, getPplxBuildId, jsonUtils } from "@/utils/utils";
import WsMessageParser from "@/utils/WsMessageParser";

export default class PplxApi {
  static async fetchUserSettings(): Promise<UserSettingsApiResponse | null> {
    const pplxBuildId = await getPplxBuildId();

    if (!pplxBuildId) return null;

    const resp = await fetchResource(
      `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/settings/org.json`,
    );

    if (
      resp.startsWith(
        '<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...',
      )
    )
      throw new Error("Cloudflare timeout");

    return jsonUtils.safeParse(resp).pageProps.dehydratedState.queries[1].state
      .data;
  }

  static async fetchCollections(): Promise<Collection[]> {
    const pplxBuildId = await getPplxBuildId();

    if (!pplxBuildId) return [];

    const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/library.json`;
    const jsonData = await fetch(url);

    if (!jsonData.ok) throw new Error("Failed to fetch collections");

    const parsedJson = jsonUtils.safeParse(await jsonData.text());

    const fetchedCollections = parsedJson.pageProps.dehydratedState.queries[1]
      .state.data.pages[0] as CollectionsApiResponse;

    if (!fetchedCollections?.length) return [];

    const collections: Collection[] = [];

    fetchedCollections.forEach((collection) => {
      collections.push({
        title: collection.title,
        uuid: collection.uuid,
        instructions: collection.instructions,
        url: collection.slug,
        description: collection.description,
        access: collection.access,
      });
    });

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
    if (!threadSlug) return null;

    const pplxBuildId = await getPplxBuildId();

    if (!pplxBuildId) return null;

    const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/search/${threadSlug}.json`;

    const resp = await fetchResource(url);

    const data = jsonUtils.safeParse(resp);

    if (!data) return null;

    return data.pageProps.dehydratedState.queries[1].state
      .data as ThreadMessageApiResponse[];
  }

  static async fetchUserProfileSettings(): Promise<UserProfileSettingsApiResponse | null> {
    const pplxBuildId = await getPplxBuildId();

    if (!pplxBuildId) return null;

    const url = `https://www.perplexity.ai/_next/data/${pplxBuildId}/en-US/settings/profile.json`;

    const resp = await fetchResource(url);

    const data = jsonUtils.safeParse(resp);

    if (!data) return null;

    return data.pageProps.profile as UserProfileSettingsApiResponse;
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

  static async updateUserProfileSettings(data: UserProfileSettingsApiRequest) {
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
          messageCode: 421,
          event: "save_user_ai_profile",
          data: data2Send,
        }),
        timeout: 5000,
      });

      await WebpageMessageInterceptor.waitForUserProfileSettings();

      return true;
    } catch (e) {
      alert("Failed to update profile settings");
    }

    return false;
  }
}
