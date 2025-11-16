import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { useMainQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/main/Group";

const { MainQueryBoxToolbarComponentsGroup } = lazily(
  () => import("@/plugins/__ui-groups__/elements/query-box/main/Group"),
);

function MainQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useMainQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.length > 0 ||
      store.lr.components.length > 0 ||
      store.rl.components.length > 0 ||
      store.rr.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["home", "comet_ntp"]}
      additionalCheck={() => shouldEnable}
    >
      <MainQueryBoxToolbarComponentsGroup />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<MainQueryBoxToolbarComponentsGroupWrapper />);
}
