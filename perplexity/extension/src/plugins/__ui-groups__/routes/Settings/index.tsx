import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";

const { SettingsDashboardLink } = lazily(
  () => import("@/plugins/__ui-groups__/routes/Settings/SettingsDashboardLink"),
);

export default function SettingsPageComponents() {
  return (
    <CsUiPluginsGuard location={["settings"]}>
      <SettingsDashboardLink />
    </CsUiPluginsGuard>
  );
}
