import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    slashCommand: void;
  }
}

export default defineCorePlugin({
  id: "slashCommand",
  dependencies: ["spaRouter", "networkIntercept"],
});
