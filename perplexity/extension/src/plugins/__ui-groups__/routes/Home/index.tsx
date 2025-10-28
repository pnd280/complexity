import { Suspense } from "react";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import CometAffiliateDialog from "@/plugins/__ui-groups__/routes/Home/CometAffiliateDialog";
import { PostUpdateBadge } from "@/plugins/__ui-groups__/routes/Home/update-announcer/PostUpdateBadge";
import UpdateAnnouncer from "@/plugins/__ui-groups__/routes/Home/update-announcer/UpdateAnnouncer";

export default function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <CsUiPluginsGuard desktopOnly>
        <PostUpdateBadge />
        <UpdateAnnouncer />
      </CsUiPluginsGuard>
      <Suspense>
        <CometAffiliateDialog />
      </Suspense>
    </CsUiPluginsGuard>
  );
}
