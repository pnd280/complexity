import { useNavigate } from "react-router-dom";

import { APP_CONFIG } from "@/app.config";
import { Button } from "@/components/ui/button";
import InstantCssEnable from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/InstantCssEnable";
import { ThemeSections } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/themes/components/ThemeSections";
import { useLocalThemes } from "@/entrypoints/core-plugins/custom-themes/indexed-db/useLocalThemes";
import { BUILTIN_THEME_REGISTRY } from "@/entrypoints/core-plugins/custom-themes/themes/built-in-themes";

import TablerPlus from "~icons/tabler/plus";

export function ThemesListing() {
  const navigate = useNavigate();

  const builtInThemes = BUILTIN_THEME_REGISTRY;

  const { data: localThemes } = useLocalThemes();

  return (
    <div className="x:space-y-6">
      <div className="x:flex x:flex-wrap x:items-center x:justify-between x:gap-4">
        <div>
          <h1 className="x:mb-2 x:text-2xl x:font-bold">Themes</h1>
          <p className="x:text-muted-foreground">
            Customize your Perplexity appearance
          </p>
        </div>
        <div className="x:flex x:items-center x:gap-2">
          {APP_CONFIG.BROWSER === "chrome" && <InstantCssEnable />}

          <Button
            className="x:mx-auto x:md:mx-0 x:md:mt-auto"
            onClick={() => navigate("new")}
          >
            <TablerPlus className="x:mr-2 x:size-5" />
            Create New Theme
          </Button>
        </div>
      </div>

      <ThemeSections
        localThemes={localThemes ?? []}
        builtInThemes={builtInThemes}
      />
    </div>
  );
}
