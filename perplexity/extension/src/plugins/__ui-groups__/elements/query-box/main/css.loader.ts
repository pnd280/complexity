import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { queryBoxMainQueryBoxNormalizeCssResourceConfig } from "@/plugins/__ui-groups__/elements/query-box/main/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "normalize-main-query-box": void;
  }
}

const mainQueryBoxCss = await getVersionedRemoteResource(
  queryBoxMainQueryBoxNormalizeCssResourceConfig,
  persistentQueryClient,
);

export default function () {
  globalCssStore.getState().registerCssEntry({
    css: mainQueryBoxCss,
    id: "normalize-main-query-box",
  });
}
