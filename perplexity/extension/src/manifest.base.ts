import type { ManifestV3Export } from "@crxjs/vite-plugin";

import { APP_CONFIG } from "./app.config";
import packageData from ".././package.json";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type ManifestV3Options = Exclude<Awaited<ManifestV3Export>, Function>;

export const baseManifest: ManifestV3Options = {
  manifest_version: 3,
  name: "Complexity | Perplexity AI Supercharged",
  description:
    "Power-user toolkit: Quick model switching, custom themes, enhanced code blocks, export tools, and 20+ productivity features.",
  version: packageData.version,
  homepage_url: "https://cplx.app",

  icons: {
    16: "public/img/logo-16.png",
    32: "public/img/logo-34.png",
    48: "public/img/logo-48.png",
    128: "public/img/logo-128.png",
  },
  action: {
    default_icon: "public/img/logo-48.png",
  },
  options_ui: {
    open_in_tab: true,
    page: "src/entrypoints/options-page/options.html",
  },

  permissions: [
    "storage",
    "unlimitedStorage",
    "contextMenus",
    "declarativeNetRequestWithHostAccess",
    "scripting",
  ],
  optional_permissions: ["webNavigation"],

  host_permissions: [
    ...APP_CONFIG["perplexity-ai"].globalMatches,
    ...(APP_CONFIG.IS_DEV ? ["http://localhost:8811/*"] : []),
  ],
  optional_host_permissions: [],

  content_scripts: [
    {
      matches: APP_CONFIG["perplexity-ai"].globalMatches,
      exclude_matches: APP_CONFIG["perplexity-ai"].globalExcludeMatches,
      js: ["src/entrypoints/content-scripts/index.ts"],
      run_at: "document_end",
    },
    {
      matches: APP_CONFIG["perplexity-ai"].globalMatches,
      exclude_matches: APP_CONFIG["perplexity-ai"].globalExcludeMatches,
      js: ["src/entrypoints/content-scripts/starting-styles.ts"],
      run_at: "document_start",
    },
  ],

  web_accessible_resources: [
    {
      resources: ["public/img/logo-*.png", "*.css"],
      matches: ["*://*/*"],
    },
  ],
};
