import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    networkIntercept: void;
  }
}

export default defineCorePlugin({
  id: "networkIntercept",
  dependencies: [],
});
