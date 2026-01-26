import type { Transaction } from "dexie";
import type z from "zod";

import type { MaybePromise } from "@/types/utils.types";

export type PluginIndexedDbSchemaEntry<T extends z.ZodSchema = z.ZodSchema> = {
  schema?: string;
  rowValidationSchema?: T;
  upgrade?: (tx: Transaction) => MaybePromise<void>;
};

export type PluginIndexedDbOptions = {
  exportable?: boolean;
};

export type PluginIndexedDbSchemas<Versions = Record<number, z.ZodSchema>> = {
  schemas: {
    [Version in keyof Versions]: PluginIndexedDbSchemaEntry<
      Versions[Version] & z.ZodSchema
    >;
  };
  options?: PluginIndexedDbOptions;
};
