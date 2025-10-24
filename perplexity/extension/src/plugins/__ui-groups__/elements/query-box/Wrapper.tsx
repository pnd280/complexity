import { lazily } from "react-lazily";

import type { UiGroupId } from "@/__registries__/cs-ui/types";
import CsUiPluginsGuard from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";
import { shouldEnableUiGroup } from "@/plugins/__async-deps__/plugins-guard/predicates";
import type { whereAmI } from "@/utils/misc/utils";

declare module "@/__registries__/cs-ui/types" {
  interface UiGroupsRegistry {
    "queryBoxes:toolbar:main": void;
    "queryBoxes:toolbar:main:ll": void;
    "queryBoxes:toolbar:main:lr": void;
    "queryBoxes:toolbar:main:rl": void;
    "queryBoxes:toolbar:main:rr": void;

    "queryBoxes:toolbar:space": void;
    "queryBoxes:toolbar:space:ll": void;
    "queryBoxes:toolbar:space:lr": void;
    "queryBoxes:toolbar:space:rl": void;
    "queryBoxes:toolbar:space:rr": void;

    "queryBoxes:toolbar:followUp": void;
    "queryBoxes:toolbar:followUp:ll": void;
    "queryBoxes:toolbar:followUp:lr": void;
    "queryBoxes:toolbar:followUp:rl": void;
    "queryBoxes:toolbar:followUp:rr": void;

    "queryBoxes:toolbar:cometAssistant": void;
    "queryBoxes:toolbar:cometAssistant:rl": void;
  }
}

const QueryBoxWrappers = [
  {
    key: "main",
    groups: [
      "queryBoxes:toolbar:main",
      "queryBoxes:toolbar:main:ll",
      "queryBoxes:toolbar:main:lr",
      "queryBoxes:toolbar:main:rl",
      "queryBoxes:toolbar:main:rr",
    ],
    Component: lazily(
      () => import("@/plugins/__ui-groups__/elements/query-box/main/Main"),
    ).default,
    location: ["home", "comet_ntp"],
  },
  {
    key: "space",
    groups: [
      "queryBoxes:toolbar:space",
      "queryBoxes:toolbar:space:ll",
      "queryBoxes:toolbar:space:lr",
      "queryBoxes:toolbar:space:rl",
      "queryBoxes:toolbar:space:rr",
    ],
    Component: lazily(
      () => import("@/plugins/__ui-groups__/elements/query-box/space/Space"),
    ).default,
    location: ["collection"],
  },
  {
    key: "followUp",
    groups: [
      "queryBoxes:toolbar:followUp",
      "queryBoxes:toolbar:followUp:ll",
      "queryBoxes:toolbar:followUp:lr",
      "queryBoxes:toolbar:followUp:rl",
      "queryBoxes:toolbar:followUp:rr",
    ],
    Component: lazily(
      () =>
        import("@/plugins/__ui-groups__/elements/query-box/follow-up/FollowUp"),
    ).default,
    location: ["thread"],
  },
  {
    key: "cometAssistant",
    groups: [
      "queryBoxes:toolbar:cometAssistant",
      "queryBoxes:toolbar:cometAssistant:rl",
    ],
    Component: lazily(
      () =>
        import(
          "@/plugins/__ui-groups__/elements/query-box/comet-assistant/CometAssistant"
        ),
    ).default,
    location: ["comet_assistant"],
  },
] satisfies {
  key: string;
  groups: UiGroupId[];
  location: ReturnType<typeof whereAmI>[];
  Component: React.ComponentType;
}[];

export default function QueryBoxComponents() {
  const enabledStates = QueryBoxWrappers.map(({ groups }) =>
    groups.some((group) => shouldEnableUiGroup({ uiGroup: group })),
  );

  return (
    <>
      {QueryBoxWrappers.map(({ key, Component, location }, idx) =>
        enabledStates[idx] ? (
          <CsUiPluginsGuard key={key} location={location}>
            <Component />
          </CsUiPluginsGuard>
        ) : null,
      )}
    </>
  );
}
