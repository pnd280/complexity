import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { useThreadNavbarAttributesRegistry } from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/Group";

const { ThreadNavbarAttributesPluginsGroup } = lazily(
  () =>
    import("@/plugins/__ui-groups__/elements/thread-navbar-attributes/Group"),
);

export default function ThreadNavbarAttributesComponentsGroupWrapper() {
  const shouldEnable = useThreadNavbarAttributesRegistry(
    (store) => store.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["thread", "comet_assistant"]}
      additionalCheck={() => shouldEnable}
    >
      <ThreadNavbarAttributesPluginsGroup />
    </CsUiPluginsGuard>
  );
}
