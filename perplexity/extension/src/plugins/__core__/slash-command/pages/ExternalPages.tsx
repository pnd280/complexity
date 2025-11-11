import { useLayoutEffect } from "react";

import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/plugins/__core__/slash-command/store";

export function ExternalPages() {
  return useSlashCommandMenuStore((store) => store.externalPages.pages);
}

export function SlashCommandExternalPage({
  children,
}: {
  children: React.ReactElement;
}) {
  useLayoutEffect(() => {
    slashCommandMenuStore.getState().externalPages.addPage(children);
    return () => {
      slashCommandMenuStore.getState().externalPages.removePage(children);
    };
  }, [children]);

  return null;
}
