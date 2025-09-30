import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import HomepageUpdateAnnouncer from "@/plugins/__ui-groups__/routes/Home/HomepageUpdateAnnouncer";

export default function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <HomepageUpdateAnnouncer />
    </CsUiPluginsGuard>
  );
}
