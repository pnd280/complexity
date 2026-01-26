import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import {
  commonLocalesLazyImports,
  pluginLocalesLazyImports,
} from "@/entrypoints/registries/i18n";
import { initializeDayjsLocale, initializeI18n } from "@/services/i18n";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "lib:i18n": void;
    "lib:dayjs": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:i18n",
    loader: () =>
      initializeI18n({
        lazyGlobs: [commonLocalesLazyImports, pluginLocalesLazyImports],
      }),
  });

  AsyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:dayjs",
    loader: initializeDayjsLocale,
  });
}
