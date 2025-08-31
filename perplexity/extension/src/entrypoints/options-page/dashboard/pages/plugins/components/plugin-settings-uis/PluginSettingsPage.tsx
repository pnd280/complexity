import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";

type PluginSettingsPageProps = {
  pluginId: PluginId;
};

export default function PluginSettingsPage({
  pluginId,
}: PluginSettingsPageProps) {
  const plugin = PluginRegistry.manifests[pluginId];

  const navigate = useNavigate();

  return (
    <div className="x:space-y-6">
      <Button
        variant="ghostNoOutline"
        className="x:flex x:items-center x:gap-2 x:p-0 x:text-muted-foreground x:transition x:hover:text-foreground"
        role="link"
        onClick={() => navigate(-1)}
      >
        <LuChevronLeft />
        Back to plugins
      </Button>
      <div>
        <h1 className="x:text-2xl x:font-bold">{plugin.title}</h1>
        <p className="x:mt-2 x:text-muted-foreground">{plugin.description}</p>
      </div>
      {PLUGIN_SETTINGS_UIS[plugin.id]!.component}
    </div>
  );
}
