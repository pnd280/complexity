import { useLayoutEffect } from "react";

import { slashCommandMenuStore } from "@/plugins/__core__/slash-command/store";

export function SlashCommandExternalPage({
  children,
}: {
  children: React.ReactElement;
}) {
  useLayoutEffect(() => {
    slashCommandMenuStore.getState().pages.addPage(children);
    return () => {
      slashCommandMenuStore.getState().pages.removePage(children);
    };
  }, [children]);

  return null;
}
