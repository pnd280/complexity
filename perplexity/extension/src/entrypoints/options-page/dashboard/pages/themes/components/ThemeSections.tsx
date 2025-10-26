import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import ThemeCard from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/ThemeCard";
import { CommunityThemeCard } from "@/entrypoints/options-page/dashboard/pages/themes/components/CommunityThemeCard";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import { useCommunityThemes } from "@/hooks/useCommunityThemes";

import TablerRefresh from "~icons/tabler/refresh";
import TablerAlertTriangle from "~icons/tabler/alert-triangle";
import TablerExternalLink from "~icons/tabler/external-link";

type ThemeSectionsProps = {
  builtInThemes: Theme[];
  localThemes: Theme[];
};

export function ThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  const { isMobile } = useIsMobileStore();

  if (builtInThemes.length === 0 && localThemes.length === 0) {
    return <div>No themes found</div>;
  }

  return isMobile ? (
    <MobileThemeSections
      builtInThemes={builtInThemes}
      localThemes={localThemes}
    />
  ) : (
    <DesktopThemeSections
      builtInThemes={builtInThemes}
      localThemes={localThemes}
    />
  );
}

function ThemesGrid({
  themes,
  type,
}: {
  themes: Theme[];
  type: "local" | "built-in";
}) {
  return (
    <div className="x:grid x:grid-cols-1 x:gap-4 x:md:grid-cols-2 x:lg:grid-cols-3 x:xl:grid-cols-4">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} type={type} />
      ))}
    </div>
  );
}

function CommunityThemesGrid() {
  const { themes, isLoading, error, refetch } = useCommunityThemes();

  if (isLoading) {
    return (
      <div className="x:grid x:grid-cols-1 x:gap-4 x:md:grid-cols-2 x:lg:grid-cols-3 x:xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="x:space-y-3">
            <Skeleton className="x:h-32 x:w-full" />
            <Skeleton className="x:h-4 x:w-3/4" />
            <Skeleton className="x:h-3 x:w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <TablerAlertTriangle className="x:h-4 x:w-4" />
        <AlertDescription className="x:flex x:items-center x:justify-between">
          <span>Failed to load community themes: {error}</span>
          <Button variant="outline" size="sm" onClick={refetch}>
            <TablerRefresh className="x:mr-2 x:h-4 x:w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="x:text-center x:py-12">
        <div className="x:text-muted-foreground x:mb-4">
          No community themes available yet.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            window.open('https://github.com/Dreadfxl/complexity-themes', '_blank');
          }}
        >
          <TablerExternalLink className="x:mr-2 x:h-4 x:w-4" />
          Contribute a Theme
        </Button>
      </div>
    );
  }

  return (
    <div className="x:space-y-4">
      <div className="x:flex x:items-center x:justify-between">
        <div className="x:text-sm x:text-muted-foreground">
          {themes.length} theme{themes.length === 1 ? '' : 's'} available
        </div>
        <div className="x:flex x:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open('https://github.com/Dreadfxl/complexity-themes', '_blank');
            }}
          >
            <TablerExternalLink className="x:mr-2 x:h-4 x:w-4" />
            Browse Repository
          </Button>
          <Button variant="outline" size="sm" onClick={refetch}>
            <TablerRefresh className="x:mr-2 x:h-4 x:w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="x:grid x:grid-cols-1 x:gap-4 x:md:grid-cols-2 x:lg:grid-cols-3 x:xl:grid-cols-4">
        {themes.map((theme) => (
          <CommunityThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function MobileThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  const defaultTab = localThemes.length > 0 ? "local" : "built-in";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="x:mx-auto x:w-full x:max-w-fit x:flex-nowrap x:overflow-x-auto x:border x:bg-secondary x:*:whitespace-nowrap">
        {localThemes.length > 0 && (
          <TabTrigger value="local">Local Themes</TabTrigger>
        )}
        {builtInThemes.length > 0 && (
          <TabTrigger value="built-in">Built-in Themes</TabTrigger>
        )}
        <TabTrigger value="community">Community Themes</TabTrigger>
      </TabsList>

      {builtInThemes.length > 0 && (
        <TabContent value="built-in" className="x:mt-4">
          <ThemesGrid themes={builtInThemes} type="built-in" />
        </TabContent>
      )}

      {localThemes.length > 0 && (
        <TabContent value="local" className="x:mt-4">
          <ThemesGrid themes={localThemes} type="local" />
        </TabContent>
      )}

      <TabContent value="community" className="x:mt-4">
        <CommunityThemesGrid />
      </TabContent>
    </Tabs>
  );
}

function DesktopThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  return (
    <div className="x:flex x:flex-col x:gap-8">
      {localThemes.length > 0 && (
        <section>
          <h2 className="x:mb-4 x:text-lg x:font-semibold">Local Themes</h2>
          <ThemesGrid themes={localThemes} type="local" />
        </section>
      )}

      {builtInThemes.length > 0 && (
        <section>
          <h2 className="x:mb-4 x:text-lg x:font-semibold">Built-in Themes</h2>
          <ThemesGrid themes={builtInThemes} type="built-in" />
        </section>
      )}

      <section>
        <h2 className="x:mb-4 x:text-lg x:font-semibold">Community Themes</h2>
        <CommunityThemesGrid />
      </section>
    </div>
  );
}
