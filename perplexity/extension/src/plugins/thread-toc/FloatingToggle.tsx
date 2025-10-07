import { usePanelPosition } from "@/plugins/thread-toc/usePanelPosition";

import TablerMenu from "~icons/tabler/menu-2";

type FloatingToggleProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function FloatingToggle({
  isOpen,
  onClick,
}: FloatingToggleProps) {
  const { position } = usePanelPosition() ?? {};

  if (position == null) return null;

  const { top } = position;

  return (
    <div
      role="button"
      className={cn(
        "x:fixed x:top-(--panel-top) x:-right-3 x:z-20 x:flex x:h-16 x:w-8 x:items-center x:justify-center x:rounded-md x:border x:border-border/50 x:bg-secondary x:text-muted-foreground x:shadow-lg x:transition-colors x:animate-in x:fade-in x:hover:text-foreground",
        {
          "x:hidden": isOpen,
        },
      )}
      style={
        {
          ["--panel-top"]: `${top}px`,
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      <TablerMenu className="x:size-4" />
    </div>
  );
}
