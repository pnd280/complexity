import type { ZodSchema } from "zod";

import { APP_CONFIG } from "@/app.config";
import { fetchTextResource } from "@/utils/utils";

export function getTParam({ interval = 0 }: { interval?: number } = {}) {
  if (interval <= 0) return Date.now();

  const nowInMilliseconds = Date.now();
  const cacheResetIntervalMs = 1000 * 60 * interval;

  return (
    Math.floor(nowInMilliseconds / cacheResetIntervalMs) * cacheResetIntervalMs
  );
}

export async function fetchResourceWithSchema<T>({
  resourcePath,
  zodSchema,
  pathPrefix,
}: {
  resourcePath: string;
  zodSchema: ZodSchema<T>;
  pathPrefix: string;
}): Promise<T> {
  const url = getUrl({
    path: `${pathPrefix}/${resourcePath}`,
  });

  const shouldJsonParse = url.pathname.endsWith(".json");

  const text = await fetchTextResource(url.toString());

  const data = shouldJsonParse ? JSON.parse(text) : text;

  return zodSchema.parse(data);
}

export function getUrl({
  path,
  passiveCacheBusterInterval,
}: {
  path: string;
  passiveCacheBusterInterval?: number;
}): URL {
  const url = new URL(APP_CONFIG.CPLX_CDN_URL!);
  url.pathname = path;
  url.searchParams.set(
    "t",
    getTParam({
      interval: passiveCacheBusterInterval ?? 0,
    }).toString(),
  );
  return url;
}
