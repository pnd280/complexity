import type { Transaction } from "dexie";

import type { MaybePromise } from "@/types/utils.types";

export type VersionsDeclaration = Map<
  number,
  {
    schemas: Record<string, string>;
    upgrades: Array<(tx: Transaction) => MaybePromise<void>>;
  }
>;
