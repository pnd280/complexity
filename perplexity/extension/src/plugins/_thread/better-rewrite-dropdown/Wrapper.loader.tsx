import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group";

const { ThreadBetterRewriteDropdown } = lazily(
  () =>
    import("@/plugins/_thread/better-rewrite-dropdown/ThreadBetterRewriteDropdown"),
);

function ThreadBetterRewriteDropdownWrapper() {
  return (
    <CsUiGuard
      requiresLoggedIn
      mustHaveActiveSub
      leastTier="pro"
      dependentPluginIds={[
        "queryBox:languageModelSelector",
        "thread:betterRewriteDropdowns",
      ]}
      excludeLocation={["comet_assistant"]}
    >
      <ThreadMessageFooterComponentRegister id="plugin:thread:betterRewriteDropdowns">
        <ThreadBetterRewriteDropdown />
      </ThreadMessageFooterComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:betterRewriteDropdowns",
    component: <ThreadBetterRewriteDropdownWrapper />,
  });
}
