import { useLoaderData, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import Page from "@/entrypoints/contexts/options-page/components/Page";
import PluginSettingsModal from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsModal";
import usePluginsStates from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/hooks/usePluginsStates";
import type {
  PluginId,
  PluginManifestExports,
} from "@/entrypoints/services/plugins/types";

export default function PluginSettingsWrapper() {
  const navigate = useNavigate();
  const plugin = useLoaderData<PluginManifestExports>();

  const { pluginsStates } = usePluginsStates();
  const pluginId = plugin.meta.id as PluginId;

  if (
    pluginsStates[pluginId].isOnMaintenance ||
    pluginsStates[pluginId].isOutdated
  ) {
    return <PluginUnavailable onBackClick={() => navigate("/plugins")} />;
  }

  return (
    <Page title={`Plugin | ${plugin.meta.name}`}>
      <PluginSettingsModal pluginId={pluginId} />
    </Page>
  );
}

function PluginUnavailable({ onBackClick }: { onBackClick: () => void }) {
  return (
    <div className="x:flex x:h-full x:min-h-[500px] x:flex-col x:items-center x:justify-center x:gap-4 x:text-center x:md:text-left">
      This plugin is not available at the moment. Please check back later.
      <Button onClick={onBackClick}>Back to dashboard</Button>
    </div>
  );
}
