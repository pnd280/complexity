import { usePopover } from "@ark-ui/react";

import { useSlashCommandMenuStore } from "@/plugins/__core__/slash-command/store";

export default function useSlashCommandPanel() {
  const open = useSlashCommandMenuStore((state) => state.open);
  const positioningOptions = useSlashCommandMenuStore(
    (state) => state.anchor.positioningOptions,
    deepEqual,
  );

  return usePopover({
    open: positioningOptions ? open : false,
    positioning: positioningOptions ?? undefined,
    portalled: true,
    autoFocus: false,
    modal: false,
  });
}
