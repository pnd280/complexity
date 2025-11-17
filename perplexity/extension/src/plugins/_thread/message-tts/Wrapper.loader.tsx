import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer/Group";

const { ThreadMessageTtsButton } = lazily(
  () => import("@/plugins/_thread/message-tts/ThreadMessageTtsButton"),
);

function ThreadMessageTtsButtonWrapper() {
  return (
    <CsUiGuard requiresLoggedIn dependentPluginIds={["thread:messageTts"]}>
      <ThreadMessageFooterComponentRegister id="plugin:thread:messageTts">
        <ThreadMessageTtsButton />
      </ThreadMessageFooterComponentRegister>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:thread:messageTts",
    component: <ThreadMessageTtsButtonWrapper />,
  });
}
