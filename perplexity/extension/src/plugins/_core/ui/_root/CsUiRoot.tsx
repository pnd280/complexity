import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazily } from "react-lazily";

import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { QueryBoxComponents } from "@/plugins/_core/ui/groups/query-box/Wrapper";
import SidebarComponents from "@/plugins/_core/ui/groups/Sidebar";
import BetterSidebarWrapper from "@/plugins/better-sidebar/Wrapper";
import CloudflareTimeoutActionDialogWrapper from "@/plugins/cloudflare-timeout-auto-reload/Wrapper";
import CommandMenuWrapper from "@/plugins/command-menu/Wrapper";
import { SlashCommandMenu } from "@/plugins/slash-command/SlashCommandMenu";

const { ExtensionContextInvalidationWatchdog } = lazily(
  () => import("@/components/ExtensionContextInvalidationWatchdog"),
);
const { PostUpdateReleaseNotesDialog } = lazily(
  () => import("@/components/PostUpdateReleaseNotesDialog"),
);
const { HomepageComponents } = lazily(
  () => import("@/plugins/_core/ui/route-groups/Home"),
);
const { SettingsComponents } = lazily(
  () => import("@/plugins/_core/ui/route-groups/Settings"),
);
const { SpacesPageComponents } = lazily(
  () => import("@/plugins/_core/ui/route-groups/SpacesPage"),
);
const { ThreadComponents } = lazily(
  () => import("@/plugins/_core/ui/route-groups/Thread"),
);
const { CometAssistantComponents } = lazily(
  () => import("@/plugins/_core/ui/route-groups/CometAssistant"),
);

export default function CsUiRoot() {
  return (
    <>
      <HomepageComponents />

      <ThreadComponents />

      <CometAssistantComponents />

      <SidebarComponents />

      <SpacesPageComponents />

      <SettingsComponents />

      <BetterSidebarWrapper />

      <QueryBoxComponents />

      <CsUiPluginsGuard excludeLocation={["comet_assistant"]}>
        <CommandMenuWrapper />
      </CsUiPluginsGuard>

      <SlashCommandMenu />

      <CloudflareTimeoutActionDialogWrapper />

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
