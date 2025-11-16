import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/plugins/__ui-groups__/elements/thread-message-footer/Group";

const { BetterMessageCopyButton } = lazily(
  () =>
    import(
      "@/plugins/thread-better-message-copy-buttons/ThreadBetterMessageCopyButton"
    ),
);

function ThreadBetterMessageCopyButtonWrapper() {
  return (
    <CsUiPluginsGuard dependentPluginIds={["thread:betterMessageCopyButtons"]}>
      <ThreadMessageFooterComponentRegister>
        <BetterMessageCopyButton />
      </ThreadMessageFooterComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<ThreadBetterMessageCopyButtonWrapper />);
}
