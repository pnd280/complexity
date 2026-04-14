import DesktopPluginSections from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-sections/Desktop";
import MobilePluginSections from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-sections/Mobile";
import { useViewport } from "@/hooks/useViewport";

export default function PluginSections() {
  const { isMobile } = useViewport();

  return isMobile ? <MobilePluginSections /> : <DesktopPluginSections />;
}
