import { z } from "zod";

import packageJson from "../package.json";

const env = typeof process === "undefined" ? import.meta.env : process.env;

const EnvVarsSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  VITE_TARGET_BROWSER: z
    .enum(["chrome", "firefox"])
    .optional()
    .prefault("chrome"),
  VITE_CPLX_CDN_URL: z.string().optional(),
  DEV: z.string().or(z.boolean()).optional(),
});

const parsedEnv = EnvVarsSchema.parse(env);

const APP_CONFIG = {
  VERSION: packageJson.version,
  DISPLAY_VERSION: versionToString(packageJson.version),
  PRERELEASE: "prerelease" in packageJson ? packageJson.prerelease : undefined,
  BROWSER: parsedEnv.VITE_TARGET_BROWSER,
  IS_DEV: Boolean(parsedEnv.DEV) || parsedEnv.NODE_ENV === "development",
  CPLX_CDN_URL: parsedEnv.VITE_CPLX_CDN_URL,
  "perplexity-ai": {
    globalMatches: ["https://www.perplexity.ai/*", "https://perplexity.ai/*"],
    globalExcludeMatches: [
      "https://stripe.perplexity.ai/*",
      "https://*.perplexity.ai/p/api/*",
      "https://*.perplexity.ai/rest/*",
      "https://*.perplexity.ai/api/*",
      "https://*.labs.perplexity.ai/*",
      "https://*.docs.perplexity.ai/*",
      "https://*.perplexity.ai/hub*",
      "https://*.perplexity.ai/changelog*",
    ],
  },
};

function versionToString(version: string): string {
  if ("prerelease" in packageJson && packageJson.prerelease) {
    return `${version}-prerelease.${packageJson.prerelease}`;
  }

  return version;
}

export { APP_CONFIG };
