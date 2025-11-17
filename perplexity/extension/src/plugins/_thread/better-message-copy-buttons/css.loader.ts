import { persistentQueryClient } from "@/entrypoints/contexts/content-scripts/services/persistent-query-client";
import { globalCssStore } from "@/entrypoints/contexts/content-scripts/stores/global-css-store";
import { getVersionedRemoteResource } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/utils";
import { hideNativeCopyButtonsCssResourceConfig } from "@/plugins/_thread/better-message-copy-buttons/index.remote-resources";

declare module "@/entrypoints/contexts/content-scripts/stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "thread-message-footer-hide-native-copy-buttons": void;
  }
}

export default async function () {
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-footer-hide-native-copy-buttons",
    css: await getVersionedRemoteResource(
      hideNativeCopyButtonsCssResourceConfig,
      persistentQueryClient,
    ),
  });
}
