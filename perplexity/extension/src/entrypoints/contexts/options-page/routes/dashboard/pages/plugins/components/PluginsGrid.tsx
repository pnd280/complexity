import PluginCard from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCard";
import type {
  PluginId,
  PublicPlugins,
} from "@/entrypoints/services/plugins/types";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  return (
    <div className="x:grid x:gap-4 x:sm:grid-cols-2 x:xl:grid-cols-3 x:2xl:grid-cols-4">
      {pluginIds.map((pluginId) => (
        <PluginCard key={pluginId} pluginId={pluginId as keyof PublicPlugins} />
      ))}
    </div>
  );
}
