import { createUiGroupRegistry } from "@/entrypoints/utils/ui-registry-factory";

export const {
  registry: externalPagesRegistry,
  useRegistry: useExternalPagesRegistry,
  Components: ExternalPages,
  ComponentRegister: ExternalPageRegister,
} = createUiGroupRegistry();
