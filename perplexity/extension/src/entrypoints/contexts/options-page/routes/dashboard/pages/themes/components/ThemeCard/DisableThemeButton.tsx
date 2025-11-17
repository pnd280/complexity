import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { settingsStorage } from "@/entrypoints/core-plugins/custom-themes/settings";
import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import useSettings from "@/entrypoints/hooks/useSettings";

type DisableThemeButtonProps = {
  theme: Theme;
};

export default function DisableThemeButton({ theme }: DisableThemeButtonProps) {
  const { settings, update } = useSettings(settingsStorage.storageItem);

  const isChosenTheme = settings.themeId === theme.id;

  return (
    <Tooltip content="Disable" disabled={!isChosenTheme}>
      <Button
        className={cn("x:invisible x:opacity-0", {
          "x:visible x:opacity-100": isChosenTheme,
        })}
        onClick={(e) => {
          e.stopPropagation();

          void update({
            updateFn(_prev) {
              _prev.themeId = "";
            },
          });
        }}
      >
        Unload
      </Button>
    </Tooltip>
  );
}
