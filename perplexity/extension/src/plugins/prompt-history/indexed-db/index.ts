import { nanoid } from "nanoid";

import type { PromptHistory } from "@/plugins/prompt-history/types";
import { db } from "@/services/infra/indexed-db";

export const backgroundProxyServiceName = "promptHistoryService";

export class PromptHistoryServiceImpl {
  static async add({ prompt }: { prompt: string }): Promise<string> {
    return await db.promptHistory.add({
      id: new Date().getTime().toString() + "-" + nanoid(),
      prompt,
      createdAt: new Date().getTime(),
    });
  }

  static async deduplicateAdd({ prompt }: { prompt: string }): Promise<string> {
    const mostRecentItem = await db.promptHistory.reverse().first();
    if (mostRecentItem?.prompt === prompt) {
      await db.promptHistory.update(mostRecentItem.id, {
        createdAt: new Date().getTime(),
      });
      return mostRecentItem.id;
    }
    return await this.add({ prompt });
  }

  static async deleteAll(): Promise<void> {
    await db.promptHistory.clear();
  }

  static async get(id: string): Promise<PromptHistory | undefined> {
    return await db.promptHistory.get(id);
  }

  static async getAll(): Promise<PromptHistory[]> {
    return await db.promptHistory.reverse().toArray();
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
    const collection = db.promptHistory.orderBy("createdAt").filter((item) => {
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
    await db.promptHistory.put(promptHistory);
    return promptHistory.id;
  }

  static async delete(id: string): Promise<void> {
    await db.promptHistory.delete(id);
  }
}

export type PromptHistoryService = typeof PromptHistoryServiceImpl;
