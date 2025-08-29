import { globalCssStore } from "@/plugins/_core/global-stores/global-css-store";
import { hideNativeCopyButtonsCssResourceConfig } from "@/plugins/thread-better-message-copy-buttons/index.remote-resources";
import { threadBetterRewriteDropdownHideNativeDropdownsCssResourceConfig } from "@/plugins/thread-better-rewrite-dropdown/index.remote-resources";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "thread-message-toolbar-hide-native-copy-buttons": void;
    "thread-message-toolbar-hide-native-rewrite-dropdowns": void;
  }
}

const [hideNativeCopyButtonsCss, hideNativeRewriteDropdownsCss] =
  await Promise.all([
    getVersionedRemoteResource(hideNativeCopyButtonsCssResourceConfig),
    getVersionedRemoteResource(
      threadBetterRewriteDropdownHideNativeDropdownsCssResourceConfig,
    ),
  ]);

export default function loader() {
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-toolbar-hide-native-copy-buttons",
    css: hideNativeCopyButtonsCss,
  });
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-toolbar-hide-native-rewrite-dropdowns",
    css: hideNativeRewriteDropdownsCss,
  });
}
