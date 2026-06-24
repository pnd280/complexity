import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadNavbarAttributesComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/navbar-attributes/Group";

import ThreadTtsDownloadButton from "./components/ThreadTtsDownloadButton";

function ThreadTtsDownloadButtonWrapper() {
  return (
    <CsUiGuard
      location={["thread"]}
      dependentPluginIds={["thread:ttsDownload"]}
    >
      <ThreadNavbarAttributesComponentRegister id="plugin:thread:ttsDownload">
        <ThreadTtsDownloadButton />
      </ThreadNavbarAttributesComponentRegister>
    </CsUiGuard>
  );
}

ThreadTtsDownloadButtonWrapper.displayName = "ThreadTtsDownloadButtonWrapper";

export default function () {
  csUiMount({
    id: "plugin:thread:ttsDownload:navbar",
    component: <ThreadTtsDownloadButtonWrapper />,
  });
}
