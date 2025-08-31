import { onMessage } from "webext-bridge/content-script";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { DomSelectorsService } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors";
import { domSelectorsResourceConfig } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/index.remote-resources";
import type { DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:domSelectors": DomSelectors;
  }
}

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "cache:domSelectors": () => DomSelectors;
  }
}

export default async function () {
  asyncLoaderRegistry.register({
    id: "cache:domSelectors",
    dependencies: [],
    loader: async () => {
      const data = await getVersionedRemoteResource(domSelectorsResourceConfig);

      DomSelectorsService.remote = data;

      return data;
    },
  });

  onMessage("cache:domSelectors", () => {
    return DomSelectorsService.remote ?? DomSelectorsService.local;
  });
}
