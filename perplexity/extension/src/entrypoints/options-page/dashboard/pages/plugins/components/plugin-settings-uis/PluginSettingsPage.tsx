import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PluginSettingsUis } from "@/data/registries/plugin-settings-uis";
import { PluginManifestsRegistry } from "@/data/registries/plugins";
import type { PluginId } from "@/data/registries/plugins/meta.types";

import TablerChevronLeft from "~icons/tabler/chevron-left";

type PluginSettingsPageProps = {
  pluginId: PluginId;
};

export default function PluginSettingsPage({
  pluginId,
}: PluginSettingsPageProps) {
  const plugin = PluginManifestsRegistry.meta[pluginId];

  const navigate = useNavigate();

  return (
    <div className="x:space-y-6">
      <Button
        variant="ghostNoOutline"
        className="x:flex x:items-center x:gap-2 x:p-0 x:text-muted-foreground x:transition x:hover:text-foreground"
        role="link"
        onClick={() => navigate(-1)}
      >
        <TablerChevronLeft />
        Back to plugins
      </Button>
      <div>
        <h1 className="x:text-2xl x:font-bold">{plugin.title}</h1>
        <p className="x:mt-2 x:text-muted-foreground">{plugin.description}</p>
      </div>
      {PluginSettingsUis[plugin.id]!.component}
    </div>
  );
}
