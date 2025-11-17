import DesktopPluginSections from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-sections/Desktop";
import MobilePluginSections from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-sections/Mobile";
import { useIsMobileStore } from "@/hooks/is-mobile-store";

export default function PluginSections() {
  const { isMobile } = useIsMobileStore();

  return isMobile ? <MobilePluginSections /> : <DesktopPluginSections />;
}
