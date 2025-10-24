import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache";
import { hideNativeCopyButtonsCssResourceConfig } from "@/plugins/thread-better-message-copy-buttons/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
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
