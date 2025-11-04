import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import ThreadMessageFooterPluginsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-message-footer/Wrapper";
import ThreadNavbarAttributesPluginsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/Wrapper";
import ThreadQueryEditButtonPluginsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-query-edit-button/Wrapper";

export default function ThreadComponents() {
  return (
    <CsUiPluginsGuard location={["thread", "comet_assistant"]}>
      <ThreadQueryEditButtonPluginsGroupWrapper />
      <ThreadMessageFooterPluginsGroupWrapper />
      <ThreadNavbarAttributesPluginsGroupWrapper />
    </CsUiPluginsGuard>
  );
}
