import { defineManifest, ManifestV3Export } from "@crxjs/vite-plugin";

import * as packageData from "../package.json";

type MozManifest = ManifestV3Export & {
  browser_specific_settings: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
  background: {
    service_worker?: never;
    type: "module";
  };
};

const defineMozManifest = defineManifest as unknown as (
  manifest: MozManifest,
) => MozManifest;

const isDev = process.env.NODE_ENV == "development";

export default defineMozManifest({
  name: `${isDev ? "[🛠️ Dev] " : ""}${packageData.displayName || packageData.name}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "img/logo-16.png",
    32: "img/logo-34.png",
    48: "img/logo-48.png",
    128: "img/logo-128.png",
  },
  action: {
    default_icon: "img/logo-48.png",
  },
  browser_specific_settings: {
    gecko: {
      id: "complexity@ngocdg",
      strict_min_version: "109.0",
    },
  },
  background: {
    scripts: ["src/background/index.ts"],
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://www.perplexity.ai/*", "https://perplexity.ai/*"],
      exclude_matches: [
        "https://www.perplexity.ai/p/api/*",
        "https://perplexity.ai/p/api/*",
      ],
      js: [
        "src/content-script/index.ts",
        "src/content-script/main-world/index.ts",
      ],
      run_at: "document_start",
    },
  ],
  options_page: "page/options.html",
  host_permissions: ["https://www.perplexity.ai/*", "https://perplexity.ai/*"],
  web_accessible_resources: [
    {
      resources: [
        "img/logo-16.png",
        "img/logo-34.png",
        "img/logo-48.png",
        "img/logo-128.png",
        "*.js",
        "*.css",
      ],
      matches: ["https://www.perplexity.ai/*", "https://perplexity.ai/*"],
      use_dynamic_url: false,
    },
  ],
  permissions: ["storage"],
});
