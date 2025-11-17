import { db } from "@/entrypoints/services/indexed-db";
import { getPluginTable } from "@/entrypoints/services/plugins/indexed-db";
import type {
  Db,
  QueryCacheEntry,
} from "@/services/persistent-query-client/types";

export const backgroundProxyServiceName = "queryCacheService";

export class QueryCacheServiceImpl implements Db {
  private static table = getPluginTable<QueryCacheEntry>(
    db,
    "persistentQueryClient",
  );

  async add(query: QueryCacheEntry): Promise<string> {
    return await QueryCacheServiceImpl.table.add(query);
  }

  async get(key: string): Promise<QueryCacheEntry | undefined> {
    return await QueryCacheServiceImpl.table.get(key);
  }

  async getAll(): Promise<QueryCacheEntry[]> {
    return await QueryCacheServiceImpl.table.toArray();
  }

  async update(key: string, query: QueryCacheEntry): Promise<string> {
    await QueryCacheServiceImpl.table.put(query);
    return key;
  }

  async delete(key: string): Promise<void> {
    await QueryCacheServiceImpl.table.delete(key);
  }
}
