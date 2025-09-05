import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ImageGenModelSelector } = lazily(
  () => import("@/plugins/image-gen-model-selector/ImageGenModelSelector"),
);

const ImageGenModelSelectorWrapper = withPluginsGuard(ImageGenModelSelector, {
  dependentPluginIds: ["imageGenModelSelector"],
  desktopOnly: true,
  requiresLoggedIn: true,
  mustHaveActiveSub: true,
  leastTier: "pro",
});

export default ImageGenModelSelectorWrapper;
