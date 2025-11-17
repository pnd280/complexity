import DataMigrationSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/sections/DataMigrationSection";
import DevToolsSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/sections/DevToolsSection";
import GeneralSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/sections/GeneralSection";
import TroubleshootingSection from "@/entrypoints/contexts/options-page/routes/dashboard/pages/settings/sections/TroubleshootingSection";

export function IndexPage() {
  return (
    <div className="x:mx-auto x:max-w-3xl x:space-y-8">
      <GeneralSection />
      <DataMigrationSection />
      <TroubleshootingSection />
      <DevToolsSection />
    </div>
  );
}
