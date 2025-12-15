import ExportDataButtons from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ExportDataButtons";
import ImportDataButtons from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/ImportDataButtons";
import SettingsItem from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsSection";

export default function DataMigrationSection() {
  return (
    <SettingsSection title="Data">
      <SettingsItem title="Import" description="Load saved extension's data">
        <ImportDataButtons />
      </SettingsItem>
      <SettingsItem
        title="Export"
        description="Download extension's data as a file"
      >
        <ExportDataButtons />
      </SettingsItem>
    </SettingsSection>
  );
}
