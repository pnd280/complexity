import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Image } from "@/components/ui/image";
import ExtensionIconActionSelect from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ExtensionIconActionSelect";
import ManagePermissionsDialogWrapper from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ManagePermissionsDialogWrapper";
import SettingsItem from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsSection";

import TablerExternalLink from "~icons/tabler/external-link";
import TablerQuestionCircle from "~icons/tabler/question-circle";

export default function GeneralSection() {
  const navigate = useNavigate();

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
              <TablerQuestionCircle className="x:text-muted-foreground x:transition-all x:hover:text-foreground" />
            </HoverCardTrigger>
            <HoverCardContent>
              <Image
                src="https://i.imgur.com/UF288wx.png"
                alt="Dashboard Shortcut"
                className="x:w-full"
              />
            </HoverCardContent>
          </HoverCard>
          <ExtensionIconActionSelect />
        </div>
      </SettingsItem>
      <SettingsItem
        title="Onboarding"
        description="Go through the onboarding experience again"
      >
        <Button variant="ghost" onClick={() => navigate("/onboarding")}>
          <TablerExternalLink />
        </Button>
      </SettingsItem>
    </SettingsSection>
  );
}
