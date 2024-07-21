import { Play } from 'lucide-react';

import useRenderInCanvas from '@/content-script/hooks/useRenderInCanvas';
import { cn } from '@/utils/shadcn-ui-utils';

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
        `tw-animate-in tw-fade-in tw-cursor-pointer tw-transition-all active:tw-scale-95`,
        {
          'tw-text-muted-foreground hover:tw-text-foreground': !isActive,
          'tw-text-accent-foreground': isActive,
        }
      )}
      onClick={handleRender}
    >
      <Play className="tw-size-4" />
    </div>
  );
}
