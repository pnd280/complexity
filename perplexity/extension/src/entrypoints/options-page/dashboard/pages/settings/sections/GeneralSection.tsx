import { FaRegQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
        <div className="x:flex x:items-center x:gap-4">
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger>
              <FaRegQuestionCircle className="x:text-muted-foreground x:transition-all x:hover:text-foreground" />
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="x:max-w-[400px] x:rounded-xl x:border x:border-border/50">
                <img
                  src="https://i.imgur.com/UF288wx.png"
                  alt="Dashboard Shortcut"
                  className="x:relative x:w-full x:rounded-xl x:shadow-lg"
                />
              </div>
            </HoverCardContent>
          </HoverCard>
          <ExtensionIconActionSelect />
        </div>
      </SettingsItem>
      <SettingsItem title="Show release notes after update">
        <Switch
          checked={settings?.showPostUpdateReleaseNotesPopup}
          onCheckedChange={({ checked }) =>
            mutation.mutate((store) => {
              store.showPostUpdateReleaseNotesPopup = checked;
            })
          }
        />
      </SettingsItem>
      <SettingsItem
        title="Onboarding"
        description="Go through the onboarding experience again"
      >
        <Button onClick={() => navigate("/onboarding")}>🚀 Onboarding</Button>
      </SettingsItem>
    </SettingsSection>
  );
}
