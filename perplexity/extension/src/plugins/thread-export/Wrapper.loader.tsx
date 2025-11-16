import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/plugins/__ui-groups__/elements/thread-navbar-attributes/Group";

const { ThreadExportMenu } = lazily(
  () => import("@/plugins/thread-export/ExportMenu"),
);

function ExportThreadWrapper() {
  return (
    <CsUiPluginsGuard
      location={["thread"]}
      dependentPluginIds={["thread:exportThread"]}
    >
      <ThreadNavbarAttributesComponentRegister>
        <ThreadExportMenu />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry.getState().add(<ExportThreadWrapper />);
}
