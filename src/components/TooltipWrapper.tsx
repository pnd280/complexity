import {
  ReactNode,
  useState,
} from 'react';

import { cn } from '@/lib/utils';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export type TooltipProps = {
  contentOptions?: {
    side?: Placement;
    sideOffset?: number;
  };
  children: ReactNode;
  content: ReactNode;
  contentClassName?: string;
}

export default function Tooltip({
  children,
  contentOptions,
  content,
  contentClassName,
}: TooltipProps) {
  const { side } = contentOptions || { side: 'top' };
  const { sideOffset } = contentOptions || { sideOffset: 5 };

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 140);
      } else {
        setIsOpen(true);
        setIsVisible(true);
      }
    },
    placement: side || 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(sideOffset || 5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        {isOpen && (
          <div
            className={
              'tw-whitespace-pre-line tw-max-w-[400px] tw-z-50 tw-overflow-hidden tw-font-sans'
            }
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div
              className={cn(
                'tw-rounded-md tw-bg-accent-foreground dark:tw-bg-accent tw-px-2 tw-py-1 tw-text-xs tw-text-popover dark:tw-text-popover-foreground tw-shadow-md tw-duration-150',
                {
                  '!tw-invisible': !content || content === '',
                  'tw-slide-in-from-top-2': side === 'bottom',
                  'tw-slide-in-from-bottom-2': side === 'top',
                  'tw-slide-in-from-left-2': side === 'right',
                  'tw-slide-in-from-right-2': side === 'left',
                  'tw-animate-in tw-fade-in-0 tw-zoom-in-95': isVisible,
                  'tw-animate-out tw-fade-out-0 tw-zoom-out-95': !isVisible,
                },
                contentClassName
              )}
            >
              <p className="tw-line-clamp-3">{content}</p>
            </div>
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
