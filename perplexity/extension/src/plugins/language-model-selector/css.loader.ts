import { globalCssStore } from "@/plugins/_core/global-stores/global-css-store";
import { hideNativeModelSelectorCssResourceConfig } from "@/plugins/language-model-selector/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "hide-native-model-selector": void;
  }
}

const hideNativeModelSelectorCss = await getVersionedRemoteResource(
  hideNativeModelSelectorCssResourceConfig,
);

export default function () {
  globalCssStore.getState().registerCssEntry({
    css: hideNativeModelSelectorCss,
    id: "hide-native-model-selector",
  });
}
