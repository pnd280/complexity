import { baseManifest, type ManifestV3Options } from "./manifest.base";
import { create } from "mutative";

const chromeManifest = create(baseManifest, (draft) => {
  draft.background = {
    service_worker: "src/entrypoints/background/index.ts",
    type: "module",
  };
});

export default chromeManifest as ManifestV3Options;
