import { z } from "zod";

const env = typeof process === "undefined" ? import.meta.env : process.env;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  VITE_TARGET_BROWSER: z
    .enum(["chrome", "firefox"])
    .optional()
    .default("chrome"),
  DEV: z.string().or(z.boolean()).optional(),
});

const parsedEnv = envSchema.parse(env);

const appConfig = {
  BROWSER: parsedEnv.VITE_TARGET_BROWSER,
  IS_DEV: Boolean(parsedEnv.DEV) || parsedEnv.NODE_ENV === "development",
  "perplexity-ai": {
    globalMatches: ["https://www.perplexity.ai/*", "https://perplexity.ai/*"],
    globalExcludeMatches: [
      "https://*.perplexity.ai/p/api/*",
      "https://*.perplexity.ai/hub/*",
    ],
  },
};

export default appConfig;
