import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { hideNativeModelSelectorCssResourceConfig } from "@/plugins/language-model-selector/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "hide-native-model-selector": void;
  }
}

const hideNativeModelSelectorCss = await getVersionedRemoteResource(
  hideNativeModelSelectorCssResourceConfig,
  persistentQueryClient,
);

export default function () {
  globalCssStore.getState().registerCssEntry({
    css: hideNativeModelSelectorCss,
    id: "hide-native-model-selector",
  });
}
