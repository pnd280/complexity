import DesktopPluginSections from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-sections/Desktop";
import MobilePluginSections from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-sections/Mobile";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export default function PluginSections() {
  const { isMobile } = useIsMobileStore();

  return isMobile ? <MobilePluginSections /> : <DesktopPluginSections />;
}
