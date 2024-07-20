import {
  useEffect,
  useRef,
} from 'react';

import { cn } from '@/utils/shadcn-ui-utils';
import { useToggle } from '@uidotdev/usehooks';

type ThreadTitleProps = {
  query: string;
  onClick: () => void;
  isOutOfViewport: boolean;
};

export default function ThreadTitle({
  query,
  onClick,
  isOutOfViewport,
}: ThreadTitleProps) {
  const [visible, toggleVis] = useToggle(isOutOfViewport);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isOutOfViewport) {
      toggleVis(true);
    }
  }, [isOutOfViewport, toggleVis]);

  return (
    <div
      ref={ref}
      className={cn(
        'tw-transition-all tw-max-w-[10rem] 2xl:tw-max-w-[20rem] tw-truncate tw-text-muted-foreground tw-select-none tw-cursor-pointer active:tw-scale-95 tw-font-sans tw-fade-in tw-slide-in-from-bottom tw-fade-out tw-slide-out-to-bottom tw-fill-mode-forwards',
        {
          '!tw-hidden': !visible,
          'tw-animate-in': isOutOfViewport,
          'tw-animate-out': !isOutOfViewport,
        }
      )}
      onClick={onClick}
      onAnimationEnd={() => {
        if (!isOutOfViewport) {
          toggleVis(false);
        }
      }}
    >
      <span>{query}</span>
    </div>
  );
}
