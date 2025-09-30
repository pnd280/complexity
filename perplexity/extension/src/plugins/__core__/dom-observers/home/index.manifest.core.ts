import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:home": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:home",
});
