import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadMessageFooterComponentRegister } from "@/plugins/__ui-groups__/elements/thread-message-footer/Group";

const { ThreadBetterRewriteDropdown } = lazily(
  () =>
    import(
      "@/plugins/thread-better-rewrite-dropdown/ThreadBetterRewriteDropdown"
    ),
);

function ThreadBetterRewriteDropdownWrapper() {
  return (
    <CsUiPluginsGuard
      requiresLoggedIn
      mustHaveActiveSub
      leastTier="pro"
      dependentPluginIds={[
        "queryBox:languageModelSelector",
        "thread:betterRewriteDropdowns",
      ]}
      excludeLocation={["comet_assistant"]}
    >
      <ThreadMessageFooterComponentRegister>
        <ThreadBetterRewriteDropdown />
      </ThreadMessageFooterComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<ThreadBetterRewriteDropdownWrapper />);
}
