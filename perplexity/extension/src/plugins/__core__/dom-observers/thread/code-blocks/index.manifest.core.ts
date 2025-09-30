import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:thread:codeBlocks": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:thread:codeBlocks",
  dependencies: ["domObservers:thread:messageBlocks"],
});
