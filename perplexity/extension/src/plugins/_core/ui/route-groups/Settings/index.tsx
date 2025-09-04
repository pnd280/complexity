import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { SettingsDashboardLink } = lazily(
  () =>
    import("@/plugins/_core/ui/route-groups/Settings/SettingsDashboardLink"),
);

export function SettingsComponents() {
  return (
    <CsUiPluginsGuard location={["settings"]}>
      <SettingsDashboardLink />
    </CsUiPluginsGuard>
  );
}
