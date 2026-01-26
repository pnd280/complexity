import { baseManifest, type ManifestV3Options } from "./manifest.base";
import { create } from "mutative";

const chromeManifest = create(baseManifest as ManifestV3Options, (draft) => {
  draft.background = {
    service_worker: "src/entrypoints/contexts/background/index.ts",
    type: "module",
  };
});

export default chromeManifest as ManifestV3Options;
