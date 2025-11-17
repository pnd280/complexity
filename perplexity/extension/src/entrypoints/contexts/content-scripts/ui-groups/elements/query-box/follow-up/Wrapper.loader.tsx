import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useFollowUpQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/Group";

const { FollowUpQueryBoxToolbarComponentsGroup } = lazily(
  () =>
    import(
      "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/follow-up/Group"
    ),
);

function FollowUpQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useFollowUpQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.size > 0 ||
      store.lr.components.size > 0 ||
      store.rl.components.size > 0 ||
      store.rr.components.size > 0,
  );

  return (
    <CsUiGuard location={["thread"]} additionalCheck={() => shouldEnable}>
      <FollowUpQueryBoxToolbarComponentsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:queryBox:followUp",
    component: <FollowUpQueryBoxToolbarComponentsGroupWrapper />,
  });
}
