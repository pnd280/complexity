import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import {
  queryBoxFollowUpQueryBoxNormalizeCssResourceConfig,
  queryBoxMainQueryBoxNormalizeCssResourceConfig,
} from "@/plugins/__ui-groups__/elements/query-box/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "normalize-main-query-box": void;
    "normalize-follow-up-query-box": void;
  }
}

const [mainQueryBoxCss, followUpQueryBoxCss] = await Promise.all([
  getVersionedRemoteResource(
    queryBoxMainQueryBoxNormalizeCssResourceConfig,
    persistentQueryClient,
  ),
  getVersionedRemoteResource(
    queryBoxFollowUpQueryBoxNormalizeCssResourceConfig,
    persistentQueryClient,
  ),
]);

export default function () {
  globalCssStore.getState().registerCssEntry({
    css: mainQueryBoxCss,
    id: "normalize-main-query-box",
  });
  globalCssStore.getState().registerCssEntry({
    css: followUpQueryBoxCss,
    id: "normalize-follow-up-query-box",
  });
}
