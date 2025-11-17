import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group";

const { BetterMessageCopyButton } = lazily(
  () =>
    import(
      "@/plugins/_thread/better-message-copy-buttons/ThreadBetterMessageCopyButton"
    ),
);

function ThreadBetterMessageCopyButtonWrapper() {
  return (
    <CsUiGuard dependentPluginIds={["thread:betterMessageCopyButtons"]}>
      <ThreadMessageFooterComponentRegister id="plugin:thread:betterMessageCopyButtons">
        <BetterMessageCopyButton />
      </ThreadMessageFooterComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:betterMessageCopyButtons",
    component: <ThreadBetterMessageCopyButtonWrapper />,
  });
}
