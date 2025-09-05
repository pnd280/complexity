import { LuLeafyGreen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ExtensionIconActionSelect from "@/entrypoints/options-page/dashboard/pages/settings/components/ExtensionIconActionSelect";
import ManagePermissionsDialogWrapper from "@/entrypoints/options-page/dashboard/pages/settings/components/ManagePermissionsDialogWrapper";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export default function GeneralSection() {
  const navigate = useNavigate();
  const { settings, mutation } = useExtensionSettings();

  return (
    <SettingsSection title="General">
      <SettingsItem title="Extension Permissions">
        <ManagePermissionsDialogWrapper>
          <Button>Manage</Button>
        </ManagePermissionsDialogWrapper>
      </SettingsItem>
      <SettingsItem title="Extension Icon Action">
        <ExtensionIconActionSelect />
      </SettingsItem>
      <SettingsItem title="Show post-update release notes popup">
        <Switch
          checked={settings?.showPostUpdateReleaseNotesPopup}
          onCheckedChange={({ checked }) =>
            mutation.mutate((store) => {
              store.showPostUpdateReleaseNotesPopup = checked;
            })
          }
        />
      </SettingsItem>
      {/* <SettingsItem
        title={
          <div className="x:flex x:items-center x:gap-2">
            <LuLeafyGreen className="x:text-success" />
            <span>Low Performance Mode</span>
          </div>
        }
        description={
          <div>
            <div className="x:text-sm x:text-muted-foreground">
              Enable this mode if you notice significant performance issues,
              even in smaller threads.
            </div>
            <div className="x:text-sm x:text-muted-foreground x:italic">
              (Existing tabs require a refresh to apply)
            </div>
          </div>
        }
      >
        <Switch
          checked={settings?.energySavingMode}
          onCheckedChange={({ checked }) =>
            mutation.mutate((draft) => {
              draft.energySavingMode = checked;
            })
          }
        />
      </SettingsItem> */}
      <SettingsItem
        title="Onboarding"
        description="Go through the onboarding experience again"
      >
        <Button onClick={() => navigate("/onboarding")}>🚀 Onboarding</Button>
      </SettingsItem>
    </SettingsSection>
  );
}
