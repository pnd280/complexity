import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import CometAffiliateDialog from "@/plugins/__ui-groups__/routes/Home/CometAffiliateDialog";
import HomepageUpdateAnnouncer from "@/plugins/__ui-groups__/routes/Home/HomepageUpdateAnnouncer";

export default function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <HomepageUpdateAnnouncer />
      <CometAffiliateDialog />
    </CsUiPluginsGuard>
  );
}
