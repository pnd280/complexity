import { Card } from "@/components/ui/card";
import type { PluginId } from "@/data/registries/plugins/meta.types";
import {
  PluginCardProvider,
  usePluginCardContext,
} from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardContext";
import { PluginCardFooter } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardFooter";
import { PluginCardHeader } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardHeader";
import { PluginCardTags } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginCardTags";
import { PluginLockDownOverlay } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-card/PluginLockDownOverlay";
import PluginCardSkeleton from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginCardSkeleton";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";
type PluginCardProps = {
  pluginId: PluginId;
};

const PluginCardContent = memo(() => {
  const {
    state: {
      isLoading,
      isLockedDown,
      lockdownText,
      lockdownSubText,
      isEnabled,
    },
  } = usePluginCardContext();

  const { settings } = useExtensionSettings();

  if (isLoading) {
    return <PluginCardSkeleton />;
  }

  if (!settings) return null;

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
});

const PluginCard = memo(({ pluginId }: PluginCardProps) => {
  return (
    <PluginCardProvider pluginId={pluginId}>
      <PluginCardContent />
    </PluginCardProvider>
  );
});

export default PluginCard;
