import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { ThreadMessageFooterSecondaryComponentRegister } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Thread/message-footer-secondary/Group";

import TtsDownloadButton from "./components/TtsDownloadButton";

function TtsDownloadButtonWrapper() {
  return (
    <CsUiGuard requiresLoggedIn dependentPluginIds={["thread:ttsDownload"]}>
      <ThreadMessageFooterSecondaryComponentRegister id="plugin:thread:ttsDownload">
        <TtsDownloadButton />
      </ThreadMessageFooterSecondaryComponentRegister>
    </CsUiGuard>
  );
}

TtsDownloadButtonWrapper.displayName = "TtsDownloadButtonWrapper";

export default function () {
  csUiMount({
    id: "plugin:thread:ttsDownload:messageFooter",
    component: <TtsDownloadButtonWrapper />,
  });
}
