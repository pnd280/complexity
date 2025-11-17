import { lazily } from "react-lazily";

import { withCsUiGuard } from "@/entrypoints/contexts/content-scripts/services/ui-guard/hof";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { ImageGenModelSelector } = lazily(
  () => import("@/plugins/image-gen-model-selector/ImageGenModelSelector"),
);

const ImageGenModelSelectorWrapper = withCsUiGuard(ImageGenModelSelector, {
  dependentPluginIds: ["imageGenModelSelector"],
  location: ["thread"],
  desktopOnly: true,
  requiresLoggedIn: true,
  mustHaveActiveSub: true,
  leastTier: "pro",
});

export default function () {
  csUiMount({
    id: "plugin:imageGenModelSelector",
    component: <ImageGenModelSelectorWrapper />,
  });
}
