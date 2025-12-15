import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import ThemeCard from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeCard/ThemeCard";
import type { Theme } from "@/entrypoints/core-plugins/custom-themes/themes/theme.types";
import { useIsMobileStore } from "@/hooks/is-mobile-store";

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
        <div className="x:text-center x:text-muted-foreground x:md:text-left">
          Coming soon
        </div>
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
        <div className="x:text-muted-foreground">Coming soon</div>
      </section>
    </div>
  );
}
