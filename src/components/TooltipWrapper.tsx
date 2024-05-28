import clsx from 'clsx';

import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>
          <div className="tw-flex">{children}</div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            {...contentOptions}
            className={clsx(
              'tw-whitespace-pre-line tw-max-w-[400px]',
              contentClassName,
              { '!tw-invisible': !content || content === '' }
            )}
          >
            <p className="tw-line-clamp-3">{content}</p>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}
