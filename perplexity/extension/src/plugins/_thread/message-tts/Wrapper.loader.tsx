import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterSecondaryComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer-secondary/Group";

const { ThreadMessageTtsButton } = lazily(
  () => import("@/plugins/_thread/message-tts/ThreadMessageTtsButton"),
);

function ThreadMessageTtsButtonWrapper() {
  return (
    <CsUiGuard requiresLoggedIn dependentPluginIds={["thread:messageTts"]}>
      <ThreadMessageFooterSecondaryComponentRegister id="plugin:thread:messageTts">
        <ThreadMessageTtsButton />
      </ThreadMessageFooterSecondaryComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:messageTts",
    component: <ThreadMessageTtsButtonWrapper />,
  });
}
