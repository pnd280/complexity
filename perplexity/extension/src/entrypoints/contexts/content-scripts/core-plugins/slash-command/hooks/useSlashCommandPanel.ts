import { usePopover } from "@ark-ui/react";

import { useSlashCommandMenuStore } from "@/entrypoints/contexts/content-scripts/core-plugins/slash-command/store";

export default function useSlashCommandPanel() {
  const open = useSlashCommandMenuStore((store) => store.states.open);
  const positioningOptions = useSlashCommandMenuStore(
    (store) => store.anchor.positioningOptions,
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
