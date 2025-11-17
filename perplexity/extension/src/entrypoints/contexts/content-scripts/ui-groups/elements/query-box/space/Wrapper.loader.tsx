import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useSpaceQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/Group";

const { SpaceQueryBoxToolbarComponentsGroup } = lazily(
  () =>
    import(
      "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/space/Group"
    ),
);

function SpaceQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useSpaceQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.size > 0 ||
      store.lr.components.size > 0 ||
      store.rl.components.size > 0 ||
      store.rr.components.size > 0,
  );

  return (
    <CsUiGuard location={["collection"]} additionalCheck={() => shouldEnable}>
      <SpaceQueryBoxToolbarComponentsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:queryBox:space",
    component: <SpaceQueryBoxToolbarComponentsGroupWrapper />,
  });
}
