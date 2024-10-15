import { z } from "zod";

const env = typeof process === "undefined" ? import.meta.env : process.env;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  TARGET_BROWSER: z.enum(["chrome", "firefox"]).optional().default("chrome"),
  DEV: z.string().or(z.boolean()).optional(),
  VITE_METADATA_BRANCH: z.string().optional().default("alpha"),
});

const parsedEnv = envSchema.parse(env);

const appConfig = {
  browser: parsedEnv.TARGET_BROWSER,
  isDev: Boolean(parsedEnv.DEV) || parsedEnv.NODE_ENV === "development",
  METADATA_BRANCH: parsedEnv.VITE_METADATA_BRANCH,
  "perplexity-ai": {
    globalMatches: ["https://*.perplexity.ai/*"],
    globalExcludeMatches: [
      "https://*.perplexity.ai/p/api/*",
      "https://*.perplexity.ai/hub/*",
      "https://*.labs.perplexity.ai/*",
      "https://*.docs.perplexity.ai/*",
    ],
  },
};

export default appConfig;
