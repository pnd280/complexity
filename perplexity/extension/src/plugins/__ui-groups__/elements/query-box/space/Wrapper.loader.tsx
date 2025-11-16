import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { useSpaceQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/space/Group";

const { SpaceQueryBoxToolbarComponentsGroup } = lazily(
  () => import("@/plugins/__ui-groups__/elements/query-box/space/Group"),
);

function SpaceQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useSpaceQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.length > 0 ||
      store.lr.components.length > 0 ||
      store.rl.components.length > 0 ||
      store.rr.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["collection"]}
      additionalCheck={() => shouldEnable}
    >
      <SpaceQueryBoxToolbarComponentsGroup />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<SpaceQueryBoxToolbarComponentsGroupWrapper />);
}
