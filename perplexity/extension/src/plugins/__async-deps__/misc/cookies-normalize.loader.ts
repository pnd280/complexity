import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { getCookie, setCookie } from "@/utils/dom-utils/generics";

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
