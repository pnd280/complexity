import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { initializeDayjsLocale, initializeI18n } from "@/services/infra/i18n";
import {
  commonLocalesLazyGlob,
  pluginLocalesLazyGlob,
} from "@/services/infra/i18n/consts";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "lib:i18n": void;
    "lib:dayjs": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:i18n",
    loader: () =>
      initializeI18n({
        lazyGlobs: [commonLocalesLazyGlob, pluginLocalesLazyGlob],
      }),
  });

  asyncLoaderRegistry.register({
    dependencies: [],
    id: "lib:dayjs",
    loader: initializeDayjsLocale,
  });
}
