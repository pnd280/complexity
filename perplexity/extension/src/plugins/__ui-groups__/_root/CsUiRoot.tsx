import CsUiRegistry from "@/__registries__/cs-ui";
import Misc from "@/plugins/__ui-groups__/_root/Misc";
import QueryBoxComponents from "@/plugins/__ui-groups__/elements/query-box/Wrapper";
import HomepageComponents from "@/plugins/__ui-groups__/routes/Home";
import SettingsPageComponents from "@/plugins/__ui-groups__/routes/Settings";
import ThreadComponents from "@/plugins/__ui-groups__/routes/Thread";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    global: void;
  }
}

export default function CsUiRoot() {
  return (
    <>
      {CsUiRegistry.PluginComponents}

      <ThreadComponents />

      <QueryBoxComponents />

      <HomepageComponents />

      <SettingsPageComponents />

      <Misc />
    </>
  );
}
