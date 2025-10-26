import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CommunityTheme } from "@/hooks/useCommunityThemes";
import { LocalThemesService } from "@/plugins/__core__/custom-theme/indexed-db/service-init.bg-worker";
import { useThemeStore } from "@/plugins/__core__/custom-theme/stores/useThemeStore";

import TablerDownload from "~icons/tabler/download";
import TablerEye from "~icons/tabler/eye";
import TablerCheck from "~icons/tabler/check";

type CommunityThemeCardProps = {
  theme: CommunityTheme;
};

export function CommunityThemeCard({ theme }: CommunityThemeCardProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { setActiveTheme } = useThemeStore();

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      
      // Create a local copy of the theme without community metadata
      const localTheme = {
        id: theme.id,
        title: theme.title,
        description: theme.description,
        displayBannerColors: theme.displayBannerColors,
        css: theme.css,
        config: theme.config,
      };
      
      // Save to local storage
      await LocalThemesService.Instance.create(localTheme);
      
      // Set as active theme
      setActiveTheme(theme.id);
      
      setIsInstalled(true);
      toast.success(`"${theme.title}" has been installed and activated!`);
    } catch (error) {
      console.error('Error installing theme:', error);
      toast.error('Failed to install theme. Please try again.');
    } finally {
      setIsInstalling(false);
    }
  };

  const handlePreview = () => {
    // For now, just show the theme details
    toast.info(`Theme: ${theme.title}\nDescription: ${theme.description || 'No description'}`);
  };

  return (
    <Card className="x:h-full x:flex x:flex-col">
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
        <div className="x:flex x:gap-1 x:mb-3">
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
      
      <CardFooter className="x:pt-3 x:gap-2">
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
              {isInstalling ? 'Installing...' : 'Install'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
