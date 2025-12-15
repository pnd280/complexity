import { nanoid } from "nanoid";

import { db } from "@/entrypoints/services/indexed-db";
import { getPluginTable } from "@/entrypoints/services/plugins/indexed-db";
import type { PromptHistory } from "@/plugins/prompt-history/types";

export const backgroundProxyServiceName = "promptHistoryServiceV2";

export class PromptHistoryServiceImpl {
  private static table = getPluginTable<PromptHistory>(db, "promptHistory");

  private static sanitize(prompt: string): string {
    // remove irregular whitespace characters
    const cleanText = prompt.replace(
      /[\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g,
      " ",
    );
    return cleanText;
  }

  static async add({ prompt }: { prompt: string }): Promise<string> {
    return await PromptHistoryServiceImpl.table.add({
      id: new Date().getTime().toString() + "-" + nanoid(),
      prompt: this.sanitize(prompt),
      createdAt: new Date().getTime(),
    });
  }

  static async deduplicateAdd({ prompt }: { prompt: string }): Promise<string> {
    const mostRecentItem = await PromptHistoryServiceImpl.table
      .reverse()
      .first();
    if (mostRecentItem?.prompt === prompt) {
      await PromptHistoryServiceImpl.table.update(mostRecentItem.id, {
        createdAt: new Date().getTime(),
      });
      return mostRecentItem.id;
    }
    return await this.add({ prompt });
  }

  static async deleteAll(): Promise<void> {
    await PromptHistoryServiceImpl.table.clear();
  }

  static async get(id: string): Promise<PromptHistory | undefined> {
    return await PromptHistoryServiceImpl.table.get(id);
  }

  static async getAll(): Promise<PromptHistory[]> {
    return await PromptHistoryServiceImpl.table.reverse().toArray();
  }

  static async getPaginatedItems({
    searchTerm = "",
    limit = 10,
    offset = 0,
  }: {
    searchTerm?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ items: PromptHistory[]; total: number }> {
    const collection = PromptHistoryServiceImpl.table
      .orderBy("createdAt")
      .filter((item) => {
        if (!searchTerm) return true;
        return item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      });

    const total = await collection.count();

    const items = await collection
      .reverse()
      .offset(offset)
      .limit(limit)
      .toArray();

    return { items, total };
  }

  static async update(promptHistory: PromptHistory): Promise<string> {
    await PromptHistoryServiceImpl.table.put(promptHistory);
    return promptHistory.id;
  }

  static async delete(id: string): Promise<void> {
    await PromptHistoryServiceImpl.table.delete(id);
  }
}

export type PromptHistoryService = typeof PromptHistoryServiceImpl;
