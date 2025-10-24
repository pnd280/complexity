import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";

declare module "@/plugins/__async-deps__/async-loaders" {
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
