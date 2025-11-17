import merge from "lodash/merge";
import { create } from "mutative";

import { db } from "@/entrypoints/services/indexed-db";
import { getPluginTable } from "@/entrypoints/services/plugins/indexed-db";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/_thread/better-code-blocks/types";
import type { DeepPartial } from "@/types/utils.types";

export const backgroundProxyServiceName =
  "betterCodeBlocksFineGrainedServiceV2";

export class BetterCodeBlocksFineGrainedServiceImpl {
  private static table = getPluginTable<BetterCodeBlockFineGrainedOptions>(
    db,
    "thread:betterCodeBlocks",
  );

  static async add(
    options: BetterCodeBlockFineGrainedOptions,
  ): Promise<string> {
    return await BetterCodeBlocksFineGrainedServiceImpl.table.add(options);
  }

  static async get(
    language: string,
  ): Promise<BetterCodeBlockFineGrainedOptions | null> {
    return (
      (await BetterCodeBlocksFineGrainedServiceImpl.table.get(language)) ?? null
    );
  }

  static async getAll(): Promise<BetterCodeBlockFineGrainedOptions[]> {
    return await BetterCodeBlocksFineGrainedServiceImpl.table.toArray();
  }

  static async update(
    options: BetterCodeBlockFineGrainedOptions,
  ): Promise<string> {
    await BetterCodeBlocksFineGrainedServiceImpl.table.put(options);
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

    const newSettings: BetterCodeBlockFineGrainedOptions = create(
      currentSettings,
      (draft) => {
        return merge(draft, newDraft);
      },
    );

    await BetterCodeBlocksFineGrainedServiceImpl.table.update(
      language,
      newSettings,
    );
    return language;
  }

  static async delete(language: string): Promise<void> {
    await BetterCodeBlocksFineGrainedServiceImpl.table.delete(language);
  }
}

export type BetterCodeBlocksFineGrainedService =
  typeof BetterCodeBlocksFineGrainedServiceImpl;
