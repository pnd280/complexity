import type { Theme } from "@/data/dashboard/themes/theme.types";
import { db } from "@/services/infra/indexed-db";

export const backgroundProxyServiceName = "localThemesService";

export class LocalThemesServiceImpl {
  static async add(theme: Theme): Promise<string> {
    return await db.themes.add(theme);
  }

  static async get(id: string): Promise<Theme | undefined> {
    return await db.themes.get(id);
  }

  static async getAll(): Promise<Theme[]> {
    return await db.themes.toArray();
  }

  static async update(theme: Theme): Promise<string> {
    await db.themes.put(theme);
    return theme.id;
  }

  static async delete(id: string): Promise<void> {
    await db.themes.delete(id);
  }
}

export type LocalThemesService = typeof LocalThemesServiceImpl;
