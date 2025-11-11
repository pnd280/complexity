import type { UiGroupId } from "@/__registries__/cs-ui/types";
import { queryBoxToolbarGroupComponentsFactory } from "@/__registries__/cs-ui/utils";

export default class CsUiRegistry {
  static Components = Object.values(
    import.meta.glob("@/plugins/**/*.cs-ui.tsx", {
      eager: true,
    }) as Record<
      string,
      {
        default: React.FC;
        uiGroup?: UiGroupId | UiGroupId[];
      }
    >,
  );

  static PluginComponents = (() =>
    CsUiRegistry.Components.map((module, idx) => {
      if (module.uiGroup == null) return <module.default key={idx} />;

      if (typeof module.uiGroup === "string" && module.uiGroup === "global")
        return <module.default key={idx} />;

      if (Array.isArray(module.uiGroup) && module.uiGroup.includes("global"))
        return <module.default key={idx} />;

      return null;
    }).filter((component) => component != null))();

  static ThreadQueryEditButtonGroupComponents = (() =>
    CsUiRegistry.Components.map((module, idx) => {
      if (module.uiGroup == null) return null;

      if (
        typeof module.uiGroup === "string" &&
        module.uiGroup === "thread:messageBlocks:queryEditButton"
      )
        return <module.default key={idx} />;

      if (
        Array.isArray(module.uiGroup) &&
        module.uiGroup.includes("thread:messageBlocks:queryEditButton")
      )
        return <module.default key={idx} />;
    }).filter((component) => component != null))();

  static ThreadMessageFooterGroupComponents = (() =>
    CsUiRegistry.Components.map((module, idx) => {
      if (module.uiGroup == null) return null;

      if (
        typeof module.uiGroup === "string" &&
        module.uiGroup === "thread:messageBlocks:footer"
      )
        return <module.default key={idx} />;

      if (
        Array.isArray(module.uiGroup) &&
        module.uiGroup.includes("thread:messageBlocks:footer")
      )
        return <module.default key={idx} />;
    }).filter((component) => component != null))();

  static QueryBoxToolbarMainGroupComponents =
    queryBoxToolbarGroupComponentsFactory(
      "queryBoxes:toolbar:main",
      CsUiRegistry.Components,
    );
  static QueryBoxToolbarSpaceGroupComponents =
    queryBoxToolbarGroupComponentsFactory(
      "queryBoxes:toolbar:space",
      CsUiRegistry.Components,
    );
  static QueryBoxToolbarFollowUpGroupComponents =
    queryBoxToolbarGroupComponentsFactory(
      "queryBoxes:toolbar:followUp",
      CsUiRegistry.Components,
    );
  static QueryBoxToolbarCometAssistantGroupComponents =
    queryBoxToolbarGroupComponentsFactory(
      "queryBoxes:toolbar:cometAssistant",
      CsUiRegistry.Components,
    );

  static ThreadNavbarAttributesGroupComponents = (() =>
    CsUiRegistry.Components.map((module, idx) => {
      if (module.uiGroup == null) return null;

      if (
        typeof module.uiGroup === "string" &&
        module.uiGroup === "thread:navbarAttributes"
      )
        return <module.default key={idx} />;
    }).filter((component) => component != null))();
}

(function () {
  CsUiRegistry.Components.forEach((module) => {
    invariant(
      module.default.displayName,
      "Plugin Component must have a displayName",
    );
  });
})();
