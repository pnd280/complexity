import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePluginCardContext } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardContext";

export function PluginCardHeader() {
  const {
    pluginInfo: { name, description },
  } = usePluginCardContext();

  return (
    <CardHeader className="x:flex x:flex-row x:items-start x:justify-between x:space-y-0">
      <div>
        <CardTitle>
          <span className="x:text-lg">{name}</span>
        </CardTitle>
        <CardDescription className="x:whitespace-pre-wrap">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
  );
}
