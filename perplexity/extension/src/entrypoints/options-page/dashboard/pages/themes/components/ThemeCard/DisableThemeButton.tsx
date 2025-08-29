import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import useExtensionSettings from "@/services/infra/extension-settings/useExtensionSettings";

type DisableThemeButtonProps = {
  theme: Theme;
};

export default function DisableThemeButton({ theme }: DisableThemeButtonProps) {
  const { settings, mutation } = useExtensionSettings();

  const isChosenTheme = settings?.theme === theme?.id;

  return (
    <Tooltip content="Disable" disabled={!isChosenTheme}>
      <Button
        className={cn("x:invisible x:opacity-0", {
          "x:visible x:opacity-100": isChosenTheme,
        })}
        onClick={(e) => {
          e.stopPropagation();

          mutation.mutate((draft) => {
            draft.theme = "";
          });
        }}
      >
        Unload
      </Button>
    </Tooltip>
  );
}
