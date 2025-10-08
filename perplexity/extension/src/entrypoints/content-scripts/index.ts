import {
  executeCsLoaders,
  executeLibCsLoaders,
} from "@/__registries__/cs-loaders";
import { contentScriptGuards } from "@/entrypoints/content-scripts/guards";

$(() => {
  contentScriptGuards();
  void executeLibCsLoaders();
  void executeCsLoaders();
});
