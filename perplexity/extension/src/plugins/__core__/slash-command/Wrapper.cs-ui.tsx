import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { useSlashCommandMenuStore } from "@/plugins/__core__/slash-command/store";

const { SlashCommandMenu } = lazily(
  () => import("@/plugins/__core__/slash-command/SlashCommandMenu"),
);

export default function SlashCommandMenuWrapper() {
  const shouldEnable = useSlashCommandMenuStore(
    (store) => store.externalPages.pages.length > 0,
  );

  return (
    <CsUiPluginsGuard
      dependentCorePluginIds={["slashCommand"]}
      additionalCheck={() => shouldEnable}
    >
      <SlashCommandMenu />
    </CsUiPluginsGuard>
  );
}

SlashCommandMenuWrapper.displayName = "SlashCommandMenuWrapper";

export const uiGroup: UiGroupId = "global";
