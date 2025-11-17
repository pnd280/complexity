import type z from "zod";

import type { RemoteResourceType } from "@/entrypoints/services/externals/cplx-api/types";

export type RemoteResource<T> = {
  resourcePath: string;
  type: RemoteResourceType;
  fallback: T;
  zodSchema: z.ZodType<T>;
};

export type RemoteResourceReturnType<T> = RemoteResource<T>;
