import type { PluginId } from "@/__registries__/plugins/meta.types";
import PluginCard from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  return (
    <div className="x:grid x:gap-4 x:sm:grid-cols-2 x:xl:grid-cols-3 x:2xl:grid-cols-4">
      {pluginIds.map((pluginId) => (
        <PluginCard key={pluginId} pluginId={pluginId} />
      ))}
    </div>
  );
}
