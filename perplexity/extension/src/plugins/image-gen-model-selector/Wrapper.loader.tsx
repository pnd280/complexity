import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";

const { ImageGenModelSelector } = lazily(
  () => import("@/plugins/image-gen-model-selector/ImageGenModelSelector"),
);

const ImageGenModelSelectorWrapper = withPluginsGuard(ImageGenModelSelector, {
  dependentPluginIds: ["imageGenModelSelector"],
  location: ["thread"],
  desktopOnly: true,
  requiresLoggedIn: true,
  mustHaveActiveSub: true,
  leastTier: "pro",
});

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ImageGenModelSelectorWrapper />);
}
