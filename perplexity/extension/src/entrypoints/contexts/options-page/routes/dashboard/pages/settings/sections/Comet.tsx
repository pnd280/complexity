import CometNtp from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/components/CometNtp";
import SettingsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/SettingsSection";

export default function CometSection() {
  return (
    <SettingsSection title="Comet">
      <CometNtp />
    </SettingsSection>
  );
}
