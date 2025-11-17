import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import { db } from "@/entrypoints/services/indexed-db";
import { getPluginTable } from "@/entrypoints/services/plugins/indexed-db";

export const backgroundProxyServiceName = "localThemesService";

export class LocalThemesServiceImpl {
  private static table = getPluginTable<Theme>(db, "customTheme");

  static async add(theme: Theme): Promise<string> {
    return await LocalThemesServiceImpl.table.add(theme);
  }

  static async get(id: string): Promise<Theme | undefined> {
    return await LocalThemesServiceImpl.table.get(id);
  }

  static async getAll(): Promise<Theme[]> {
    return await LocalThemesServiceImpl.table.toArray();
  }

  static async update(theme: Theme): Promise<string> {
    await LocalThemesServiceImpl.table.put(theme);
    return theme.id;
  }

  static async delete(id: string): Promise<void> {
    await LocalThemesServiceImpl.table.delete(id);
  }
}

export type LocalThemesService = typeof LocalThemesServiceImpl;
