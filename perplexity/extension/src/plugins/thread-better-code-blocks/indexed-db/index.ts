import { produce } from "immer";
import merge from "lodash/merge";

import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/types";
import { db } from "@/services/infra/indexed-db";
import type { DeepPartial } from "@/types/utils.types";

export const backgroundProxyServiceName = "betterCodeBlocksFineGrainedService";

export class BetterCodeBlocksFineGrainedServiceImpl {
  static async add(
    options: BetterCodeBlockFineGrainedOptions,
  ): Promise<string> {
    return await db["thread:betterCodeBlocks"].add(options);
  }

  static async get(
    language: string,
  ): Promise<BetterCodeBlockFineGrainedOptions | null> {
    return (await db["thread:betterCodeBlocks"].get(language)) ?? null;
  }

  static async getAll(): Promise<BetterCodeBlockFineGrainedOptions[]> {
    return await db["thread:betterCodeBlocks"].toArray();
  }

  static async update(
    options: BetterCodeBlockFineGrainedOptions,
  ): Promise<string> {
    await db["thread:betterCodeBlocks"].put(options);
    return options.language;
  }

  static async updateDraft({
    language,
    newDraft,
  }: {
    language: string;
    newDraft: DeepPartial<BetterCodeBlockFineGrainedOptions>;
  }): Promise<string> {
    const currentSettings = await this.get(language);

    if (!currentSettings) {
      throw new Error("Language not found");
    }

    const newSettings: BetterCodeBlockFineGrainedOptions = produce(
      currentSettings,
      (draft) => {
        return merge(draft, newDraft);
      },
    );

    await db["thread:betterCodeBlocks"].update(language, newSettings);
    return language;
  }

  static async delete(language: string): Promise<void> {
    await db["thread:betterCodeBlocks"].delete(language);
  }
}

export type BetterCodeBlocksFineGrainedService =
  typeof BetterCodeBlocksFineGrainedServiceImpl;
