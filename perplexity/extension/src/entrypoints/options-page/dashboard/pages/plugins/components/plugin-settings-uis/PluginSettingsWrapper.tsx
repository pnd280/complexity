import { useLoaderData, useNavigate } from "react-router-dom";

import {
  type PluginMeta,
  type PluginsSettingsRegistry,
} from "@/__registries__/plugins/meta.types";
import { Button } from "@/components/ui/button";
import Page from "@/entrypoints/options-page/components/Page";
import PluginSettingsModal from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsModal";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";

export default function PluginSettingsWrapper() {
  const navigate = useNavigate();
  const plugin = useLoaderData<PluginMeta<keyof PluginsSettingsRegistry>>();
  const { pluginsStates } = usePluginsStates();

  if (
    pluginsStates[plugin.id].isOnMaintenance ||
    pluginsStates[plugin.id].isOutdated
  ) {
    return <PluginUnavailable onBackClick={() => navigate("/plugins")} />;
  }

  return (
    <Page title={`Plugin | ${plugin.title}`}>
      <PluginSettingsModal pluginId={plugin.id} />
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
