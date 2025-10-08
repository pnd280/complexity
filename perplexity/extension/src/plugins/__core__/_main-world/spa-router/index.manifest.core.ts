import { defineCorePlugin } from "@/__registries__/core-plugins/utils";

declare module "@/__registries__/core-plugins/types" {
  interface CorePluginsRegistry {
    spaRouter: void;
  }
}

export default defineCorePlugin({
  id: "spaRouter",
});
