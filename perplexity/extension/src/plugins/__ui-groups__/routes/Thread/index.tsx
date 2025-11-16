import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import ThreadMessageFooterComponentsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-message-footer/Wrapper";
import ThreadNavbarAttributesComponentsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/Wrapper";
import ThreadQueryEditButtonComponentsGroupWrapper from "@/plugins/__ui-groups__/elements/thread-query-edit-button/Wrapper";

export default function ThreadComponents() {
  return (
    <CsUiPluginsGuard location={["thread", "comet_assistant"]}>
      <ThreadQueryEditButtonComponentsGroupWrapper />
      <ThreadMessageFooterComponentsGroupWrapper />
      <ThreadNavbarAttributesComponentsGroupWrapper />
    </CsUiPluginsGuard>
  );
}
