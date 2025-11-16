import { createUiGroupRegistry } from "@/plugins/__ui-groups__/registry-factory";

export const {
  registry: externalPagesRegistry,
  useRegistry: useExternalPagesRegistry,
  Components: ExternalPages,
  ComponentRegister: ExternalPageRegister,
} = createUiGroupRegistry();
