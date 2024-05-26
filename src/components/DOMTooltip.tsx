import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';
import $ from 'jquery';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export default function DOMTooltip({
  container,
  children,
  className,
  contentOptions,
  delayDuration = 200,
}: {
  container: Element;
  children: React.ReactNode;
  className?: string;
  contentOptions?: React.ComponentProps<typeof TooltipPrimitive.Content>;
  delayDuration?: number;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    $(container).off('mouseenter').off('mouseleave');

    $(container)
      .on('mouseenter', () => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => setOpen(true), delayDuration);
      })
      .on('mouseleave', () => {
        clearTimeout(timeoutId);
        setOpen(false);
      })
      .on('click', () => {
        clearTimeout(timeoutId);
        setOpen(false);
      });
  }, [container]);

  if (!container) return null;

  return (
    <>
      <div
        className={clsx('tw-absolute tw-pointer-events-none', className)}
        style={{
          top: `${container.getBoundingClientRect().top}px`,
          left: `${container.getBoundingClientRect().left}px`,
          width: `${container.getBoundingClientRect().width}px`,
          height: `${container.getBoundingClientRect().height}px`,
        }}
      >
        <TooltipProvider>
          <Tooltip open={open}>
            <TooltipTrigger>
              <div
                style={{
                  top: `${container.getBoundingClientRect().top}px`,
                  left: `${container.getBoundingClientRect().left}px`,
                  width: `${container.getBoundingClientRect().width}px`,
                  height: `${container.getBoundingClientRect().height}px`,
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent
              {...contentOptions}
              className="tw-pointer-events-auto"
            >
              {children}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
