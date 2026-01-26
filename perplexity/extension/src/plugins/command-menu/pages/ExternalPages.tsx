import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

export const {
  registry: externalPagesRegistry,
  Components: ExternalPages,
  ComponentRegister: ExternalPageRegister,
} = createUiGroupRegistry();
