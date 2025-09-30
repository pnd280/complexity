import { defineCorePlugin } from "@/data/registries/core-plugins/utils";

declare module "@/data/registries/core-plugins/types" {
  interface CorePluginsRegistry {
    spaRouter: void;
  }
}

export default defineCorePlugin({
  id: "spaRouter",
});
