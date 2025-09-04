import type z from "zod";

import type { RemoteResourceType } from "@/services/cplx-api/types";

export type RemoteResource<T> = {
  resourcePath: string;
  type: RemoteResourceType;
  fallback: T;
  zodSchema: z.ZodType<T>;
};

export type RemoteResourceReturnType<T> = RemoteResource<T>;
