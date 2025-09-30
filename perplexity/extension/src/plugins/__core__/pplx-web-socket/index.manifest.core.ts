import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    webSocket: void;
  }
}

export default defineCorePlugin({
  id: "webSocket",
});
