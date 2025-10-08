import type CsUiRegistry from "@/__registries__/cs-ui";
import type { UiGroupId } from "@/__registries__/cs-ui/types";

const queryBoxToolbarGroupSuffixes = ["ll", "lr", "rl", "rr"] as const;

export function queryBoxToolbarGroupComponentsFactory(
  prefix: UiGroupId,
  Components: typeof CsUiRegistry.Components,
): Record<(typeof queryBoxToolbarGroupSuffixes)[number], React.ReactNode> {
  return Object.fromEntries(
    queryBoxToolbarGroupSuffixes.map((suffix) => [
      suffix,
      Components.map((module, idx) => {
        if (module.uiGroup == null) return null;

        if (
          typeof module.uiGroup === "string" &&
          module.uiGroup === (`${prefix}:${suffix}` as UiGroupId)
        )
          return <module.default key={idx} />;

        if (
          Array.isArray(module.uiGroup) &&
          module.uiGroup.includes(`${prefix}:${suffix}` as UiGroupId)
        )
          return <module.default key={idx} />;
      }).filter((component) => component != null),
    ]),
  ) as unknown as Record<
    (typeof queryBoxToolbarGroupSuffixes)[number],
    React.ReactNode
  >;
}
