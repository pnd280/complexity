import { defineCorePlugin } from "@/__registries__/core-plugins/utils";

declare module "@/__registries__/core-plugins/types" {
  interface CorePluginsRegistry {
    webSocket: void;
  }
}

export default defineCorePlugin({
  id: "webSocket",
});
