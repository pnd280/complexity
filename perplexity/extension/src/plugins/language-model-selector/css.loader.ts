import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { globalCssStore } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { hideNativeModelSelectorCssResourceConfig } from "@/plugins/language-model-selector/index.remote-resources";

declare module "@/entrypoints/contexts/content-scripts/stores/global-css-store" {
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
