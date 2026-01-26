import { Card } from "@/components/ui/card";
import {
  PluginCardProvider,
  usePluginCardContext,
} from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import { PluginCardFooter } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardFooter";
import { PluginCardHeader } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardHeader";
import { PluginCardTags } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginCardTags";
import { PluginLockDownOverlay } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-card/PluginLockDownOverlay";
import PluginCardSkeleton from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/PluginCardSkeleton";
import type { PublicPlugins } from "@/entrypoints/services/plugins/types";

type PluginCardProps = {
  pluginId: keyof PublicPlugins;
};

function PluginCardContent() {
  const {
    state: {
      isLoading,
      isLockedDown,
      lockdownText,
      lockdownSubText,
      isEnabled,
    },
  } = usePluginCardContext();

  if (isLoading) {
    return <PluginCardSkeleton />;
  }

  return (
    <div className="x:relative">
      <Card
        className={cn(
          "x:flex x:h-full x:flex-col x:bg-secondary x:transition-all",
          {
            "x:border-primary/10 x:bg-primary/5 x:shadow-md": isEnabled,
          },
        )}
      >
        <PluginCardHeader />
        <PluginCardTags />
        <PluginCardFooter />
      </Card>
      {isLockedDown && (
        <PluginLockDownOverlay text={lockdownText} subText={lockdownSubText} />
      )}
    </div>
  );
}

export default function PluginCard({ pluginId }: PluginCardProps) {
  return (
    <PluginCardProvider pluginId={pluginId}>
      <PluginCardContent />
    </PluginCardProvider>
  );
}
