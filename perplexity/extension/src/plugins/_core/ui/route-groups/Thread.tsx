import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { default: ThreadMessageFooterExtraButtonsWrapper } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-footer/Wrapper"),
);
const { default: ThreadQueryEditButtonGroupExtraButtonsWrapper } = lazily(
  () =>
    import("@/plugins/_core/ui/groups/thread-query-edit-button-group/Wrapper"),
);
const { default: ArtifactsWrapper } = lazily(
  () => import("@/plugins/artifacts/Wrapper"),
);
const { default: ExportThreadWrapper } = lazily(
  () => import("@/plugins/thread-export/Wrapper"),
);
const { default: ImageGenModelSelectorWrapper } = lazily(
  () => import("@/plugins/image-gen-model-selector/Wrapper"),
);
const { default: BetterCodeBlocksWrapper } = lazily(
  () => import("@/plugins/thread-better-code-blocks/Wrapper"),
);
const { default: ThreadTocWrapper } = lazily(
  () => import("@/plugins/thread-toc/Wrapper"),
);

export function ThreadComponents() {
  return (
    <CsUiPluginsGuard location={["thread"]}>
      <ImageGenModelSelectorWrapper />

      <ArtifactsWrapper />

      <BetterCodeBlocksWrapper />

      <ThreadTocWrapper />

      <ExportThreadWrapper />

      <ThreadQueryEditButtonGroupExtraButtonsWrapper />

      <ThreadMessageFooterExtraButtonsWrapper />
    </CsUiPluginsGuard>
  );
}
