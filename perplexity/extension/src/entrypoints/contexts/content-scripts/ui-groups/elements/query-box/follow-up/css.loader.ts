import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { globalCssStore } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { queryBoxFollowUpQueryBoxNormalizeCssResourceConfig } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/index.remote-resources";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/entrypoints/contexts/content-scripts/stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "normalize-follow-up-query-box": void;
  }
}

const followUpQueryBoxCss = await getVersionedRemoteResource(
  queryBoxFollowUpQueryBoxNormalizeCssResourceConfig,
  persistentQueryClient,
);

export default function () {
  globalCssStore.getState().registerCssEntry({
    css: followUpQueryBoxCss,
    id: "normalize-follow-up-query-box",
  });
}
