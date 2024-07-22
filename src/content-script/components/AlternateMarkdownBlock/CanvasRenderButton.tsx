import { Play } from "lucide-react";

import useRenderInCanvas from "@/content-script/hooks/useRenderInCanvas";
import { cn } from "@/utils/cn";

type CanvasRenderButtonProps = {
  preBlockId: string;
};

export default function CanvasRenderButton({
  preBlockId,
}: CanvasRenderButtonProps) {
  const { isActive, handleRender } = useRenderInCanvas({
    preBlockId,
  });

  return (
    <div
      className={cn(
        `tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95`,
        {
          "tw-text-muted-foreground hover:tw-text-foreground": !isActive,
          "tw-text-accent-foreground": isActive,
        },
      )}
      onClick={handleRender}
    >
      <Play className="tw-size-4" />
    </div>
  );
}
