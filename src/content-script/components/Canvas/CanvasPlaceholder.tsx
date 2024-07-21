import { LoaderCircle } from 'lucide-react';

import useRenderInCanvas from '@/content-script/hooks/useRenderInCanvas';
import { CanvasLang } from '@/utils/Canvas';
import { cn } from '@/utils/shadcn-ui-utils';

import { canvasPlaceholders } from './';

type CanvasPlaceholderProps = React.HTMLAttributes<HTMLDivElement> & {
  preBlockId: string;
  lang: CanvasLang;
};

export default function CanvasPlaceholder({
  preBlockId,
  lang,
  className,
  ...props
}: CanvasPlaceholderProps) {
  const { title, description, icon } = canvasPlaceholders[lang];

  const { isActive, handleRender } = useRenderInCanvas({
    preBlockId,
  });

  return (
    <div
      className={cn(
        `canvas-placeholder tw-select-none tw-absolute tw-inset-0 tw-size-full tw-w-[300px] tw-flex tw-items-center tw-border tw-rounded-md tw-overflow-hidden tw-cursor-pointer active:tw-scale-95 tw-transition-all tw-duration-300 tw-z-10 tw-animate-in tw-fade-in-50 ${preBlockId}-inflight-indicator tw-group`,
        {
          '!tw-border-accent-foreground': isActive,
          'hover:!tw-border-foreground-darker': !isActive,
        },
        className
      )}
      onClick={handleRender}
      {...props}
    >
      <div className="tw-h-full tw-aspect-square tw-flex tw-justify-center tw-items-center tw-bg-secondary tw-border-r">
        <div
          className={cn('tw-hidden group-data-[inflight="false"]:tw-block', {
            '[&>*]:tw-text-accent-foreground': isActive,
          })}
        >
          {icon}
        </div>
        <div className='group-data-[inflight="false"]:tw-hidden'>
          <LoaderCircle className="tw-text-accent-foreground tw-size-4 tw-animate-spin" />
        </div>
      </div>
      <div className="tw-ml-4 tw-flex tw-flex-col">
        <div
          className={cn('tw-font-medium tw-text-base tw-transition-colors', {
            'tw-text-accent-foreground': isActive,
            'tw-text-foreground': !isActive,
          })}
        >
          {title}
        </div>
        <div className='tw-text-muted-foreground tw-font-sans tw-text-[.8rem] tw-hidden group-data-[inflight="false"]:tw-block'>
          {description}
        </div>
        <div className='tw-text-muted-foreground tw-animate-pulse tw-font-sans tw-text-[.8rem] group-data-[inflight="false"]:tw-hidden'>
          Generating...
        </div>
      </div>
    </div>
  );
}
