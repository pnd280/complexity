import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-client";
import { queryBoxFollowUpQueryBoxNormalizeCssResourceConfig } from "@/plugins/__ui-groups__/elements/query-box/follow-up/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
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
