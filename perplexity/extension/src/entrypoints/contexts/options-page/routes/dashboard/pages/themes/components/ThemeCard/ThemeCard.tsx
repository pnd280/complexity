import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import ThemeCardBanner from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeCard/Banner";
import DisableThemeButton from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeCard/DisableThemeButton";
import ThemeCardEditButton from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeCard/EditThemeButton";
import { settingsStorage } from "@/entrypoints/core-plugins/custom-themes/settings";
import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import useSettings from "@/entrypoints/hooks/useSettings";

type ThemeCardProps = {
  theme?: Theme;
  type: "local" | "built-in";
};

export default function ThemeCard({ theme, type }: ThemeCardProps) {
  const { settings, update } = useSettings(settingsStorage.storageItem);

  if (!theme) return null;

  const isChosenTheme = settings.themeId === theme.id;

  return (
    <Card
      className={cn(
        "x:group x:relative x:flex x:cursor-pointer x:flex-col x:overflow-hidden x:border-border/50 x:bg-secondary x:transition-all",
        { "x:border-primary/50 x:bg-primary/10": isChosenTheme },
      )}
      onClick={() => {
        void update({
          updateFn(_prev) {
            _prev.themeId = theme.id;
          },
        });
      }}
    >
      <div className="x:relative x:aspect-video x:overflow-hidden">
        <ThemeCardBanner theme={theme} />
      </div>

      <CardHeader className="x:space-y-0">
        <CardTitle className="x:text-lg">{theme.config.title}</CardTitle>
        <CardDescription>{theme.description}</CardDescription>
      </CardHeader>

      <CardFooter className="x:flex x:flex-row x:justify-end x:gap-2">
        <DisableThemeButton theme={theme} />
        {type === "local" && <ThemeCardEditButton theme={theme} />}
      </CardFooter>
    </Card>
  );
}
