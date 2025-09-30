import { useEffect } from "react";

import { useSidebarDomObserverStore } from "@/plugins/__core__/dom-observers/sidebar/store";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

const attrId = "better-sidebar-mobile-trigger-hook";

export default function useHookMobileTrigger() {
  const mobileTrigger = useSidebarDomObserverStore(
    (state) => state.mobileTrigger,
    deepEqual,
  );

  useEffect(() => {
    if (mobileTrigger == null) return;

    const isHooked = mobileTrigger.getAttribute(attrId) === "true";

    if (isHooked) return;

    mobileTrigger.setAttribute(attrId, "true");

    const clickHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      betterSidebarStore.getState().setOpen(true);
    };

    mobileTrigger.addEventListener("click", clickHandler);

    return () => {
      mobileTrigger.removeEventListener("click", clickHandler);
      mobileTrigger.removeAttribute(attrId);
    };
  }, [mobileTrigger]);
}
