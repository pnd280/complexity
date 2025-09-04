import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { BUILTIN_THEME_REGISTRY } from "@/data/dashboard/themes/built-in-themes";
import { ThemeSections } from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeSections";
import { useLocalThemes } from "@/plugins/_core/custom-theme/index.public";

export function ThemesListing() {
  const navigate = useNavigate();

  const builtInThemes = useMemo(() => BUILTIN_THEME_REGISTRY, []);

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
        <Button
          className="x:mx-auto x:md:mx-0 x:md:mt-auto"
          onClick={() => navigate("new")}
        >
          <LuPlus className="x:mr-2 x:size-5" />
          Create New Theme
        </Button>
      </div>

      <ThemeSections
        localThemes={localThemes ?? []}
        builtInThemes={builtInThemes}
      />
    </div>
  );
}
