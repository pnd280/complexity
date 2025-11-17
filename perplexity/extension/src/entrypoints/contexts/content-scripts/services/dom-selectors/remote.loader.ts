import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { domSelectorsResourceConfig } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/index.remote-resources";
import type { DomSelectors } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
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
