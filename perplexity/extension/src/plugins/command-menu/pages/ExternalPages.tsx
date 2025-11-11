import { useLayoutEffect } from "react";

import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/plugins/command-menu/store";

export function ExternalPages() {
  return useCommandMenuStore((store) => store.externalPages.pages);
}

export function CommandMenuExternalPage({
  children,
}: {
  children: React.ReactElement;
}) {
  useLayoutEffect(() => {
    commandMenuStore.getState().externalPages.addPage(children);
    return () => {
      commandMenuStore.getState().externalPages.removePage(children);
    };
  }, [children]);

  return null;
}
