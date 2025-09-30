import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazily } from "react-lazily";

import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";

const { ExtensionContextInvalidationWatchdog } = lazily(
  () => import("@/components/ExtensionContextInvalidationWatchdog"),
);
const { PostUpdateReleaseNotesDialog } = lazily(
  () => import("@/components/PostUpdateReleaseNotesDialog"),
);

export default function Misc() {
  return (
    <>
      <CsUiPluginsGuard
        desktopOnly
        additionalCheck={({ settings }) =>
          settings.showPostUpdateReleaseNotesPopup &&
          !settings.isPostUpdateReleaseNotesPopupDismissed
        }
      >
        <PostUpdateReleaseNotesDialog />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard browser={["chrome"]}>
        <ExtensionContextInvalidationWatchdog />
      </CsUiPluginsGuard>

      <Toaster
        viewportProps={{
          className:
            "x:top-0 x:md:[:where(body:is([location=thread],[location=collection])_*)]:top-[var(--header-height,70px)]",
        }}
      />

      <ReactQueryDevtools />
    </>
  );
}
