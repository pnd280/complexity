import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PluginRegistry } from "@/data/plugin-registry/index";
import { isPluginId, type PluginId } from "@/data/plugin-registry/types";
import Page from "@/entrypoints/options-page/components/Page";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";
import PluginSettingsModal from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsModal";
import PluginSettingsPage from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsPage";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { default as PluginsListing } from "@/entrypoints/options-page/dashboard/pages/plugins/IndexPage";
import useClearLocationState from "@/hooks/useClearLocationState";
// import useClearSearchParams from "@/hooks/useClearSearchParams";

export default function PluginSettingsWrapper() {
  useClearLocationState();

  const navigate = useNavigate();
  const location = useLocation();
  const { pluginId: pluginRouteSegment } = useParams();
  const { pluginsStates } = usePluginsStates();

  const plugin = useMemo(
    () =>
      Object.values(PluginRegistry.manifests).find(
        (p) => p.settingsUiRouteSegment === pluginRouteSegment,
      ),
    [pluginRouteSegment],
  );

  useNavigateAwayOnInvalidRoute({ pluginId: plugin?.id });

  const isFromPluginList = location.state?.fromPluginList === true;
  const isOpenInFullScreen =
    plugin != null && PLUGIN_SETTINGS_UIS[plugin.id]!.openInFullScreen;

  // const searchParamsToCllear = useMemo(() => ["searchTerm"], []);
  // useClearSearchParams({ enabled: !isFromPluginList, params: searchParamsToCllear });

  if (!plugin || !isPluginId(plugin.id)) {
    return null;
  }

  if (
    pluginsStates[plugin.id].isOnMaintenance ||
    pluginsStates[plugin.id].isOutdated
  ) {
    return <PluginUnavailable onBackClick={() => navigate("/plugins")} />;
  }

  return (
    <>
      {isFromPluginList && !isOpenInFullScreen ? (
        <>
          <PluginsListing />
          <PluginSettingsModal pluginId={plugin.id} />
        </>
      ) : (
        <Page title={plugin.title}>
          <PluginSettingsPage pluginId={plugin.id} />
        </Page>
      )}
    </>
  );
}

function useNavigateAwayOnInvalidRoute({ pluginId }: { pluginId?: PluginId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!pluginId) {
      navigate("/plugins", { replace: true });
    }
  }, [pluginId, navigate]);
}

function PluginUnavailable({ onBackClick }: { onBackClick: () => void }) {
  return (
    <div className="x:flex x:h-full x:min-h-[500px] x:flex-col x:items-center x:justify-center x:gap-4 x:text-center x:md:text-left">
      This plugin is not available at the moment. Please check back later.
      <Button onClick={onBackClick}>Back to dashboard</Button>
    </div>
  );
}
