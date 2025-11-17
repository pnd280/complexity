import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { PostUpdateBadge } from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Home/update-announcer/PostUpdateBadge";
import UpdateAnnouncer from "@/entrypoints/contexts/content-scripts/ui-groups/routes/Home/update-announcer/UpdateAnnouncer";

function HomepageComponents() {
  return (
    <CsUiGuard location={["home"]}>
      <CsUiGuard desktopOnly>
        <PostUpdateBadge />
        <UpdateAnnouncer />
      </CsUiGuard>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:home",
    component: <HomepageComponents />,
  });
}
