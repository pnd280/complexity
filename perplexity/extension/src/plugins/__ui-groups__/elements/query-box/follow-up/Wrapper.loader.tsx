import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { csUiRootComponentsRegistry } from "@/plugins/__ui-groups__/_root/CsUiRoot";
import { useFollowUpQueryBoxToolbarRegistry } from "@/plugins/__ui-groups__/elements/query-box/follow-up/Group";

const { FollowUpQueryBoxToolbarComponentsGroup } = lazily(
  () => import("@/plugins/__ui-groups__/elements/query-box/follow-up/Group"),
);

function FollowUpQueryBoxToolbarComponentsGroupWrapper() {
  const shouldEnable = useFollowUpQueryBoxToolbarRegistry(
    (store) =>
      store.ll.components.length > 0 ||
      store.lr.components.length > 0 ||
      store.rl.components.length > 0 ||
      store.rr.components.length > 0,
  );

  return (
    <CsUiPluginsGuard
      location={["thread"]}
      additionalCheck={() => shouldEnable}
    >
      <FollowUpQueryBoxToolbarComponentsGroup />
    </CsUiPluginsGuard>
  );
}

export default function loader() {
  csUiRootComponentsRegistry
    .getState()
    .add(<FollowUpQueryBoxToolbarComponentsGroupWrapper />);
}
