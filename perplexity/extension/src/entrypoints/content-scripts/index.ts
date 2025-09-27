import { contentScriptGuards } from "@/entrypoints/content-scripts/guards";
import { executeCsPluginLoaders } from "@/entrypoints/content-scripts/loaders";

$(() => {
  contentScriptGuards();
  executeCsPluginLoaders();
});
