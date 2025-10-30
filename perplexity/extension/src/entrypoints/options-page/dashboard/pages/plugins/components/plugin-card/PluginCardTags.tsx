import { CardContent } from "@/components/ui/card";
import { usePluginCardContext } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import { PluginTag } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginTag";

export function PluginCardTags() {
  const {
    pluginInfo: { tags },
  } = usePluginCardContext();

  if (tags.length === 0) return null;

  return (
    <CardContent>
      <div className="x:flex x:flex-wrap x:gap-2">
        {tags.map((tag) => (
          <PluginTag key={tag} tag={tag} />
        ))}
      </div>
    </CardContent>
  );
}
