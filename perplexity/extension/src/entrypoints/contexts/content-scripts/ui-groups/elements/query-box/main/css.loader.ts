import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { globalCssStore } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { queryBoxMainQueryBoxNormalizeCssResourceConfig } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/index.remote-resources";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/entrypoints/contexts/content-scripts/stores/global-css-store" {
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
