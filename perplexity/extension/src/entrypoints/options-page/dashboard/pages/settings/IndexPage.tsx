import DataSection from "@/entrypoints/options-page/dashboard/pages/settings/sections/DataSection";
import DevToolsSection from "@/entrypoints/options-page/dashboard/pages/settings/sections/DevToolsSection";
import GeneralSection from "@/entrypoints/options-page/dashboard/pages/settings/sections/GeneralSection";
import SupportSection from "@/entrypoints/options-page/dashboard/pages/settings/sections/SupportSection";
import TroubleshootingSection from "@/entrypoints/options-page/dashboard/pages/settings/sections/TroubleshootingSection";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";

export function IndexPage() {
  const { settings } = useExtensionSettings();

  return (
    <div className="x:mx-auto x:max-w-3xl x:space-y-8">
      <GeneralSection />
      <DataSection />
      <SupportSection />
      <TroubleshootingSection />
      {settings?.devMode && <DevToolsSection />}
    </div>
  );
}
