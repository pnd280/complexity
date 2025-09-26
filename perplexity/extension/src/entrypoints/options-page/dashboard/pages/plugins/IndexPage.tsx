import PluginSections from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-sections/PluginSections";
import PluginsFilter from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter";
import SearchInput from "@/entrypoints/options-page/dashboard/pages/plugins/components/SearchInput";
import PluginsEnableSet from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsEnableSet";

export default function IndexPage() {
  return (
    <div className="x:flex x:size-full x:flex-col x:gap-4 x:md:mt-0">
      <div className="x:flex x:flex-col x:items-center x:justify-between x:gap-4 x:md:flex-row">
        <div className="x:text-center x:text-sm x:text-balance x:text-muted-foreground x:md:text-left">
          A full page reload on Perplexity.ai is required when changing plugin
          settings.
        </div>
        <PluginsEnableSet />
      </div>

      <div className="x:flex x:w-full x:gap-2 x:md:w-md">
        <SearchInput />
        <PluginsFilter />
      </div>

      <PluginSections />
    </div>
  );
}
