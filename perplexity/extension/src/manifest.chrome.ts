import { baseManifest, type ManifestV3Options } from "./manifest.base";
import { produce } from "immer";

const chromeManifest = produce(baseManifest, (draft) => {
  draft.background = {
    service_worker: "src/entrypoints/background/index.ts",
    type: "module",
  };
});

export default chromeManifest as ManifestV3Options;
