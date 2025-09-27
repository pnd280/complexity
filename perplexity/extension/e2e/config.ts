import { normalizePath } from "@/utils/misc/normalize-path";

export const E2E_CONFIG = {
  HEADLESS: process.env.E2E_HEADLESS !== "false",
  CHROME_PATH: process.env.CHROME_PATH,
  TEMP_CHROME_INSTANCES_DIR: normalizePath(
    process.env.TEMP_CHROME_INSTANCES_DIR ?? "./e2e/chrome-instances",
    process.cwd(),
  ),
  EXTENSION_PATH: normalizePath("dist", process.cwd()),
  TIMEOUTS: {
    HEADING_VISIBLE: 10000,
  },
};
