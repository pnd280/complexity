import { globalCssStore } from "@/plugins/__async-deps__/global-stores/global-css-store";
import { threadBetterRewriteDropdownHideNativeDropdownsCssResourceConfig } from "@/plugins/thread-better-rewrite-dropdown/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/__async-deps__/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "thread-message-footer-hide-native-rewrite-dropdowns": void;
  }
}

export default async function () {
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-footer-hide-native-rewrite-dropdowns",
    css: await getVersionedRemoteResource(
      threadBetterRewriteDropdownHideNativeDropdownsCssResourceConfig,
    ),
  });
}
