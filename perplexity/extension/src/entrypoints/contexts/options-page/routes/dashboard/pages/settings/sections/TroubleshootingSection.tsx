import ClearAllDataButton from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ClearAllDataButton";
import ClearRemoteResourcesCache from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ClearRemoteResourcesCache";
import ExportDebugDataButtons from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ExportDebugDataButtons/ExportDebugDataButtons";
import SupportChannels from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/SupportChannels";
import SettingsItem from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsSection";

export default function TroubleshootingSection() {
  return (
    <SettingsSection title="Troubleshooting">
      <SettingsItem title="Debug" description="Include in bug reports">
        <ExportDebugDataButtons />
      </SettingsItem>
      <SettingsItem title="Clear cache">
        <ClearRemoteResourcesCache />
      </SettingsItem>
      <SettingsItem title="Reset the extension">
        <ClearAllDataButton />
      </SettingsItem>
      <SettingsItem
        title="Need assistance?"
        description="Get help from the community or email support"
      >
        <SupportChannels />
      </SettingsItem>
    </SettingsSection>
  );
}
