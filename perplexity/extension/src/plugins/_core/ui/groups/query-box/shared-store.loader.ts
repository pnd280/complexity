import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { populateDefaults } from "@/plugins/_core/ui/groups/query-box/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:initSharedStore": void;
  }
}

export default function () {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:initSharedStore",
    dependencies: ["cache:languageModels"],
    loader: () => {
      populateDefaults();
    },
  });
}
