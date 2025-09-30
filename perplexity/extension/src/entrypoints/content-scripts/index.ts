import {
  executeCsLoaders,
  executeLibCsLoaders,
} from "@/data/registries/cs-loaders";
import { contentScriptGuards } from "@/entrypoints/content-scripts/guards";

$(() => {
  contentScriptGuards();
  executeLibCsLoaders();
  executeCsLoaders();
});
