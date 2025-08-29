import { Dexie, type Table } from "dexie";

import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import { legacyThemeMigration } from "@/data/dashboard/themes/migration";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import type { QueryCacheEntry } from "@/data/query-client/utils";
import type { PromptHistory } from "@/plugins/prompt-history/index.public";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/index.public";

export class IndexedDbService extends Dexie {
  queryCache!: Table<QueryCacheEntry>;
  themes!: Table<Theme>;
  betterCodeBlocks!: Table<BetterCodeBlockFineGrainedOptions>;
  promptHistory!: Table<PromptHistory>;

  constructor() {
    super("ComplexityDatabase");
    this.version(6).stores({
      queryCache: "&key, timestamp",
      themes: "&id, title, author",
      betterCodeBlocks: "&language",
      promptHistory: "&id, prompt, createdAt",
    });

    this.version(7).upgrade((tx) => {
      return tx.table("themes").toCollection().modify(legacyThemeMigration);
    });
  }

  async exportAll(): Promise<ExtensionData["db"]> {
    const themes = await this.themes.toArray();
    const betterCodeBlocksFineGrainedOptions =
      await this.betterCodeBlocks.toArray();
    const promptHistory = await this.promptHistory.toArray();
    return {
      themes,
      betterCodeBlocksFineGrainedOptions,
      promptHistory,
    };
  }

  async import(data: ExtensionData["db"]) {
    await this.themes.bulkPut(data.themes);
    await this.betterCodeBlocks.bulkPut(
      data.betterCodeBlocksFineGrainedOptions,
    );
    await this.promptHistory.bulkPut(data.promptHistory);
  }

  async clearAll() {
    await this.themes.clear();
    await this.betterCodeBlocks.clear();
    await this.promptHistory.clear();
    await this.queryCache.clear();
  }
}

export const db = new IndexedDbService();
