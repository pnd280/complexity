import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/plugins/__ui-groups__/elements/thread-message-footer/Group";

const { ThreadMessageTtsButton } = lazily(
  () => import("@/plugins/thread-message-tts/ThreadMessageTtsButton"),
);

function ThreadMessageTtsButtonWrapper() {
  return (
    <CsUiPluginsGuard
      requiresLoggedIn
      dependentPluginIds={["thread:messageTts"]}
    >
      <ThreadMessageFooterComponentRegister>
        <ThreadMessageTtsButton />
      </ThreadMessageFooterComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ThreadMessageTtsButtonWrapper />);
}
