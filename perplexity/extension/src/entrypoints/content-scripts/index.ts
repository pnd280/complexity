import "@/utils/libs-init";

import { contentScriptGuards } from "@/entrypoints/content-scripts/guards";
import { executeCsPluginLoaders } from "@/entrypoints/content-scripts/loaders";

$(async () => {
  contentScriptGuards();
  executeCsPluginLoaders();
});
