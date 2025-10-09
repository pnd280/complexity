import { defineCorePlugin } from "@/__registries__/core-plugins/utils";

declare module "@/__registries__/core-plugins/types" {
  interface CorePluginsRegistry {
    "domObservers:settingsPage": void;
  }
}

export default defineCorePlugin({
  id: "domObservers:settingsPage",
  dependencies: ["spaRouter"],
});
