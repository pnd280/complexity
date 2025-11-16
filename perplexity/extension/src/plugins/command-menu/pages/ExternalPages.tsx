import { createUiGroupRegistry } from "@/plugins/__ui-groups__/registry-factory";

export const {
  registry: externalPagesRegistry,
  Components: ExternalPages,
  ComponentRegister: ExternalPageRegister,
} = createUiGroupRegistry();
