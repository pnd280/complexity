import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import HomepageUpdateAnnouncer from "@/plugins/_core/ui/route-groups/Home/HomepageUpdateAnnouncer";

export function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <HomepageUpdateAnnouncer />
    </CsUiPluginsGuard>
  );
}
