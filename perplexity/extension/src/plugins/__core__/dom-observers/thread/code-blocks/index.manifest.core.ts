import { defineCorePlugin } from "@/__registries__/core-plugins/utils";

declare module "@/__registries__/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:thread:codeBlocks": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:thread:codeBlocks",
  dependencies: ["domObservers:thread:messageBlocks"],
});
