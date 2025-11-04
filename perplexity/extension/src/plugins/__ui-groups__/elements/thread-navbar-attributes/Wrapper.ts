import { lazily } from "react-lazily";

import { shouldEnableUiGroup } from "@/plugins/__async-deps__/plugins-guard/predicates";
import { withPluginsGuard } from "@/plugins/__async-deps__/plugins-guard/withPluginsGuard";

const { ThreadNavbarAttributesPluginsGroup } = lazily(
  () =>
    import("@/plugins/__ui-groups__/elements/thread-navbar-attributes/Group"),
);

const ThreadNavbarAttributesPluginsGroupWrapper = withPluginsGuard(
  ThreadNavbarAttributesPluginsGroup,
  {
    location: ["thread", "comet_assistant"],
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:navbarAttributes",
      }),
  },
);

export default ThreadNavbarAttributesPluginsGroupWrapper;
