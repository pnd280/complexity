import {
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

let timeoutId: number;

export default function TooltipWrapper({
  children,
  content,
  contentOptions,
  contentClassName,
  delayDuration = 200,
}: {
  children: React.ReactNode;
  content?: string;
  contentOptions?: React.ComponentProps<typeof TooltipContent>;
  contentClassName?: string;
  delayDuration?: number;
}) {
  if (!content) return children;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <div className="tw-flex">{children}</div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            {...contentOptions}
            className={clsx(contentClassName)}
          >
            <p>{content}</p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
