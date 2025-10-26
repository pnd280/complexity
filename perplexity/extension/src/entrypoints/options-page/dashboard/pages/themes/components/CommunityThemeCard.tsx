import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useExtensionSettings from "@/services/infra/extension-api-wrappers/extension-settings/useExtensionSettings";
import {
  generateThemeData,
  initialValues,
} from "@/data/dashboard/themes/utils";
import type {
  Theme,
  ThemeFormValues,
} from "@/data/dashboard/themes/theme.types";
import type { CommunityTheme } from "@/hooks/useCommunityThemes";
import { LocalThemesService } from "@/plugins/__core__/custom-theme/indexed-db/service-init.bg-worker";
import { useLocalThemes } from "@/plugins/__core__/custom-theme/indexed-db/useLocalThemes";

import TablerDownload from "~icons/tabler/download";
import TablerEye from "~icons/tabler/eye";
import TablerCheck from "~icons/tabler/check";

type CommunityThemeCardProps = {
  theme: CommunityTheme;
};

export function CommunityThemeCard({ theme }: CommunityThemeCardProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { data: localThemes, refetch: refetchLocalThemes } = useLocalThemes();
  const { mutation: settingsMutation } = useExtensionSettings();

  useEffect(() => {
    if (localThemes?.some((localTheme) => localTheme.id === theme.id)) {
      setIsInstalled(true);
    }
  }, [localThemes, theme.id]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      if (!theme.config) {
        throw new Error("Theme configuration is missing.");
      }

      const fullConfig: ThemeFormValues = {
        ...initialValues,
        ...theme.config,
        fonts: {
          ...initialValues.fonts,
          ...theme.config.fonts,
        },
      };

      const { css, displayBannerColors } = generateThemeData(
        fullConfig,
        initialValues,
      );

      const processedTheme: Theme = {
        id: theme.id,
        title: theme.title,
        description: theme.description,
        css,
        displayBannerColors,
        config: fullConfig,
      };

      await LocalThemesService.Instance.update(processedTheme);

      settingsMutation.mutate((draft) => {
        draft.theme = processedTheme.id;
      });

      await refetchLocalThemes();
      setIsInstalled(true);
      toast.success(`Theme "${theme.title}" has been installed and activated!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Error installing theme:", error);
      toast.error(`Failed to install theme: ${errorMessage}`);
    } finally {
      setIsInstalling(false);
    }
  };

  const handlePreview = () => {
    toast.info(
      `Theme: ${theme.title}\nDescription: ${theme.description || "No description"}`,
    );
  };

  return (
    <Card className="x:flex x:h-full x:flex-col">
      <CardHeader className="x:pb-3">
        <div className="x:flex x:items-start x:justify-between x:gap-2">
          <CardTitle className="x:line-clamp-1 x:text-base">
            {theme.title}
          </CardTitle>
          <Badge variant="secondary" className="x:shrink-0 x:text-xs">
            Community
          </Badge>
        </div>
        {theme.description && (
          <CardDescription className="x:line-clamp-2">
            {theme.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="x:flex-1">
        <div className="x:mb-3 x:flex x:gap-1">
          {theme.displayBannerColors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="x:h-6 x:flex-1 x:rounded x:border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="x:text-xs x:text-muted-foreground">
          Source: {theme.fileName}
        </div>
      </CardContent>

      <CardFooter className="x:gap-2 x:pt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
          className="x:flex-1"
        >
          <TablerEye className="x:mr-2 x:size-4" />
          Preview
        </Button>

        <Button
          size="sm"
          onClick={handleInstall}
          disabled={isInstalling || isInstalled}
          className="x:flex-1"
        >
          {isInstalled ? (
            <>
              <TablerCheck className="x:mr-2 x:size-4" />
              Installed
            </>
          ) : (
            <>
              <TablerDownload className="x:mr-2 x:size-4" />
              {isInstalling ? "Installing..." : "Install"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
