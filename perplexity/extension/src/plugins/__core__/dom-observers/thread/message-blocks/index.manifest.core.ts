import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:thread:messageBlocks": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:thread:messageBlocks",
  dependencies: ["domObservers:thread"],
});
