import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "plugin:cookiesNormalization": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "plugin:cookiesNormalization",
    dependencies: [],
    loader: () => {
      // ___
    },
  });
}
