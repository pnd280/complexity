import type { ManifestV3Export } from "@crxjs/vite-plugin";

export type ChromeManifest = ManifestV3Export & {
  background: {
    service_worker: string;
    type: "module";
  };
};

export const manifest: ManifestV3Export = {
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
