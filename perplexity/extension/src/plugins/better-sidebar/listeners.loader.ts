import { applyLayoutShiftPreventionInstantCss } from "@/plugins/better-sidebar/prevent-layout-shift.loader";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";
import { PluginsStatesService } from "@/services/features/plugins-states";
import { setCookie } from "@/utils/dom-utils/generics";

export default function () {
  betterSidebarStore.subscribe(
    (store) => store.open,
    (open) => {
      const pluginsStates = PluginsStatesService.cachedEnableStates;

      if (!pluginsStates) return;

      setCookie("isSidebarPinned", open.toString(), 365);
      applyLayoutShiftPreventionInstantCss({
        enabled: true,
      });
    },
    { equalityFn: deepEqual },
  );
}
