import { MatchPattern } from "@webext-core/match-patterns";

import { APP_CONFIG } from "@/app.config";
import { getInstantCssStorageService } from "@/services/features/instant-css/storage/service-init.bg-worker";
import { insertCss } from "@/utils/utils";

export const excludeMatchesPatterns = APP_CONFIG[
  "perplexity-ai"
].globalExcludeMatches.map((pattern) => new MatchPattern(pattern));

export const matchesPatterns = APP_CONFIG["perplexity-ai"].globalMatches.map(
  (pattern) => new MatchPattern(pattern),
);

export async function getProcessedCssEntries() {
  const settings = await getInstantCssStorageService().get();

  return [
    ...Object.entries(settings).map(([id, entry]) => ({
      id,
      ...entry,
    })),
    {
      id: "injected-mark",
      css: ":root { --cplx-instant-css-injected: 1; }",
    },
  ];
}

export async function manualInjectAllRegisteredEntries() {
  const entries = await getProcessedCssEntries();

  for (const { id, css } of entries) {
    insertCss({
      id,
      css,
    });
  }
}
