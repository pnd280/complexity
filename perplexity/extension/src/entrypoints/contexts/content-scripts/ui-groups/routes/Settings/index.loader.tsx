import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

const { SettingsDashboardLink } = lazily(
  () =>
    import("@/entrypoints/contexts/content-scripts/ui-groups/routes/Settings/SettingsDashboardLink"),
);

function SettingsPageComponents() {
  return (
    <CsUiGuard location={["settings"]}>
      <SettingsDashboardLink />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:settings",
    component: <SettingsPageComponents />,
  });
}
