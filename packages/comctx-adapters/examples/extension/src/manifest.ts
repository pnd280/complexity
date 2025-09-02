import type { ManifestV3Export } from "@crxjs/vite-plugin";

export type ChromeManifest = ManifestV3Export & {
  background: {
    service_worker: string;
    type: "module";
  };
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type ManifestV3Options = Exclude<Awaited<ManifestV3Export>, Function>;

export type MozManifest = ManifestV3Options & {
  browser_specific_settings: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
  };
};

export const manifest: ChromeManifest = {
  manifest_version: 3,
  name: "comctx-adapters",
  description: "",
  version: "0.1.0",
  host_permissions: ["<all_urls>"],
  background: {
    service_worker: "src/entrypoints/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/entrypoints/content/index.ts"],
      matches: ["https://*.google.com/*"],
    },
  ],
  action: {
    default_popup: "src/entrypoints/popup/index.html",
  },
  options_page: "src/entrypoints/options-page/index.html",
};
// export const manifest: MozManifest = {
//   browser_specific_settings: {
//     gecko: {
//       id: "test@ngocdg",
//       strict_min_version: "109.0",
//     },
//   },
//   manifest_version: 3,
//   name: "comctx-adapters",
//   description: "",
//   version: "0.1.0",
//   host_permissions: ["<all_urls>"],
//   background: {
//     scripts: ["src/entrypoints/background/index.ts"],
//     type: "module",
//   },
//   content_scripts: [
//     {
//       js: ["src/entrypoints/content/index.ts"],
//       matches: ["https://*.google.com/*"],
//     },
//   ],
//   action: {
//     default_popup: "src/entrypoints/popup/index.html",
//   },
//   options_page: "src/entrypoints/options-page/index.html",
// };
