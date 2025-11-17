import { lazily } from "react-lazily";

import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";
import { useMainQueryBoxToolbarRegistry } from "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/Group";

const { MainQueryBoxToolbarComponentsGroup } = lazily(
  () =>
    import(
      "@/entrypoints/contexts/content-scripts/ui-groups/elements/query-box/main/Group"
    ),
);

function MainQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useMainQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.size > 0 ||
      store.lr.components.size > 0 ||
      store.rl.components.size > 0 ||
      store.rr.components.size > 0,
  );

  return (
    <CsUiGuard
      location={["home", "comet_ntp"]}
      additionalCheck={() => shouldEnable}
    >
      <MainQueryBoxToolbarComponentsGroup />
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "uiGroup:queryBox:main",
    component: <MainQueryBoxToolbarComponentsGroupWrapper />,
  });
}
