import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { getDomSelectorsRootService } from "@/plugins/_core/cache/dom-selectors/service-init.loader";
import { domSelectorsResourceConfig } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/index.remote-resources";
import type { DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:domSelectors": DomSelectors;
  }
}

export default async function () {
  asyncLoaderRegistry.register({
    id: "cache:domSelectors",
    dependencies: [],
    loader: async () => {
      const data = await getVersionedRemoteResource(domSelectorsResourceConfig);

      getDomSelectorsRootService().remote = data;

      return data;
    },
  });
}
