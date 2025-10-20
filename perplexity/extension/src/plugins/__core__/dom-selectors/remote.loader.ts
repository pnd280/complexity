import { AsyncLoaderRegistry } from "@/plugins/__async-deps__/async-loaders";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { DomSelectorsService } from "@/plugins/__core__/dom-selectors/service-init.loader";
import { domSelectorsResourceConfig } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/index.remote-resources";
import type { DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/async-loaders" {
  interface AsyncLoadersRegistry {
    "cache:domSelectors": DomSelectors;
  }
}

export default async function () {
  AsyncLoaderRegistry.register({
    id: "cache:domSelectors",
    dependencies: [],
    loader: async () => {
      const data = await getVersionedRemoteResource(
        domSelectorsResourceConfig,
        persistentQueryClient,
      );

      DomSelectorsService.Root.remote = data;

      return data;
    },
  });
}
