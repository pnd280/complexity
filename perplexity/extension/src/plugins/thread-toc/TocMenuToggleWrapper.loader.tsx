import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/Group";

const { TocMenuToggle } = lazily(
  () => import("@/plugins/thread-toc/TocMenuToggle"),
);

function TocMenuToggleWrapper() {
  return (
    <CsUiPluginsGuard location={["thread"]} dependentPluginIds={["thread:toc"]}>
      <ThreadNavbarAttributesComponentRegister>
        <TocMenuToggle />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<TocMenuToggleWrapper />);
}
