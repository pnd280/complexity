import { contentScriptGuards } from "@/entrypoints/contexts/content-scripts/guards";
import {
  executeCsLoaders,
  executeLibCsLoaders,
} from "@/entrypoints/registries/context-loaders/cs-loaders";

contentScriptGuards();
void executeLibCsLoaders();
void executeCsLoaders();
