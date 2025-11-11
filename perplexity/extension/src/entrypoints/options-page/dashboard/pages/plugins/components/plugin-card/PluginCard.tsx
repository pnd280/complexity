import type { PluginId } from "@/__registries__/plugins/meta.types";
import { Card } from "@/components/ui/card";
import {
  PluginCardProvider,
  usePluginCardContext,
} from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import { PluginCardFooter } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardFooter";
import { PluginCardHeader } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardHeader";
import { PluginCardTags } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardTags";
import { PluginLockDownOverlay } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginLockDownOverlay";
import PluginCardSkeleton from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginCardSkeleton";
type PluginCardProps = {
  pluginId: PluginId;
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
