import { baseManifest, type ManifestV3Options } from "./manifest.base";
import { create } from "mutative";

export type MozManifest = ManifestV3Options & {
  browser_specific_settings: {
    gecko: {
      id: string;
      strict_min_version: string;
    };
    gecko_android: {
      strict_min_version: string;
    };
  };
};

const mozManifest = create(baseManifest as unknown as MozManifest, (draft) => {
  draft.browser_specific_settings = {
    gecko: {
      id: "complexity@ngocdg",
      strict_min_version: "109.0",
      data_collection_permissions: {
        required: ["none"],
      },
    },
    gecko_android: {
      strict_min_version: "120.0",
    },
  };
  draft.background = {
    scripts: ["src/entrypoints/contexts/background/index.ts"],
    type: "module",
  };
  draft.commands = {
    _execute_action: {
      description: "Activate the extension",
    },
  };
});

export default mozManifest as ManifestV3Options;
