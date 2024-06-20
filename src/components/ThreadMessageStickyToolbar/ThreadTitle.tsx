import {
  useEffect,
  useRef,
} from 'react';

import { cn } from '@/lib/utils';
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
    } else {
      setTimeout(() => {
        toggleVis(false);
      }, 290);
    }
  }, [isOutOfViewport, toggleVis]);

  return (
    <div
      ref={ref}
      className={cn(
        'tw-transition-all tw-max-w-[20rem] tw-truncate tw-text-muted-foreground tw-select-none tw-cursor-pointer active:tw-scale-95 tw-duration-300 tw-font-sans tw-fade-in tw-slide-in-from-bottom tw-fade-out tw-slide-out-to-bottom',
        {
          '!tw-hidden': !visible,
          'tw-animate-in': isOutOfViewport,
          'tw-animate-out': !isOutOfViewport,
        }
      )}
      onClick={onClick}
    >
      <span>{query}</span>
    </div>
  );
}
