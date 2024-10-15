import {
  defineManifest as defineChromeManifest,
  ManifestV3Export,
} from "@crxjs/vite-plugin";
import chalk from "chalk";

import packageData from "../package.json";
import appConfig from "./app.config";

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

const defineMozManifest = defineChromeManifest as unknown as (
  manifest: MozManifest,
) => MozManifest;

const browser = appConfig.browser;

const baseManifest: ManifestV3Export = {
  name: `${appConfig.isDev ? "[🟡 Dev] " : ""}${packageData.displayName || packageData.name}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "img/logo-16.png",
    32: "img/logo-34.png",
    48: "img/logo-48.png",
    128: "img/logo-128.png",
  },
  homepage_url: "https://cplx.vercel.app",
  action: {
    default_icon: "img/logo-48.png",
  },
  content_scripts: [
    {
      matches: appConfig["perplexity-ai"].globalMatches,
      exclude_matches: appConfig["perplexity-ai"].globalExcludeMatches,
      js: [
        "src/content-script/index.ts",
        "src/content-script/main-world/index.ts",
      ],
      run_at: "document_start",
    },
  ],
  options_ui: { open_in_tab: true, page: "src/options-page/options.html" },
  host_permissions: appConfig["perplexity-ai"].globalMatches,
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
      matches: appConfig["perplexity-ai"].globalMatches,
    },
  ],
  permissions: ["storage", "scripting"],
};

function createManifest(): ManifestV3Export | MozManifest {
  console.log("\n", chalk.bold.underline.yellow("TARGET BROWSER:"), browser);

  if (browser === "firefox") {
    const mozManifest: MozManifest = {
      ...baseManifest,
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
    } as MozManifest;
    return defineMozManifest(mozManifest);
  } else {
    const chromeManifest: ManifestV3Export = {
      ...baseManifest,
      background: {
        service_worker: "src/background/index.ts",
        type: "module",
      },
    } as ManifestV3Export;
    return defineChromeManifest(chromeManifest);
  }
}

export default createManifest();
