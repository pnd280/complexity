import type { MaybePromise } from "@tanstack/react-query-persist-client";
import type z from "zod";

export type PluginSettingsSchemaEntry<T extends z.ZodSchema = z.ZodSchema> = {
  schema: T;
  fallback: z.infer<T>;
  upgrade?: (previous: unknown) => MaybePromise<z.infer<T>>;
};

export type PluginSettingsSchemas<Versions = Record<number, z.ZodSchema>> = {
  [Version in keyof Versions]: PluginSettingsSchemaEntry<
    Versions[Version] & z.ZodSchema
  >;
};
