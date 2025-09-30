import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:internalSearchStates": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:internalSearchStates",
});
