import {
  commonLocalesLazyGlob,
  pluginLocalesLazyGlob,
} from "@/data/registries/i18n";
import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { initializeDayjsLocale, initializeI18n } from "@/services/infra/i18n";

declare module "@/plugins/__async-deps__/async-loaders" {
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
        lazyGlobs: [commonLocalesLazyGlob, pluginLocalesLazyGlob],
      }),
  });

  AsyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:dayjs",
    loader: initializeDayjsLocale,
  });
}
