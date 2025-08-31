import { globalCssStore } from "@/plugins/_core/global-stores/global-css-store";
import { queryBoxFollowUpQueryBoxNormalizeCssResourceConfig } from "@/plugins/_core/ui/index.remote-resources";
import { queryBoxMainQueryBoxNormalizeCssResourceConfig } from "@/plugins/_core/ui/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "normalize-main-query-box": void;
    "normalize-follow-up-query-box": void;
  }
}

const [mainQueryBoxCss, followUpQueryBoxCss] = await Promise.all([
  getVersionedRemoteResource(queryBoxMainQueryBoxNormalizeCssResourceConfig),
  getVersionedRemoteResource(
    queryBoxFollowUpQueryBoxNormalizeCssResourceConfig,
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
