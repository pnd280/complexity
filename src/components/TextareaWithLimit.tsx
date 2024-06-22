import {
  forwardRef,
  useEffect,
  useState,
} from 'react';

import clsx from 'clsx';

import { cn } from '@/lib/utils';

export type TextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    limit?: number;
    triggerCounterLimitOffset?: number;
  };

const TextareaWithLimit = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, limit, triggerCounterLimitOffset = 0, ...props }, ref) => {
    const [value, setValue] = useState(
      ((props.defaultValue || props.value) as string) || ''
    );

    useEffect(() => {
      setValue(((props.defaultValue || props.value) as string) || '');
    }, [props.value, props.defaultValue]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    };

    return (
      <div className="tw-w-full tw-h-full tw-relative">
        <textarea
          className={cn(
            'tw-flex tw-min-h-[80px] tw-h-full tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
            className
          )}
          ref={ref}
          {...props}
          onChange={(value) => {
            handleChange(value);
            props?.onChange?.(value);
          }}
        />
        {limit && value.length > limit - triggerCounterLimitOffset && (
          <div
            className={clsx(
              'tw-gap-sm tw-bg-background tw-right-1 tw-absolute tw-flex tw-items-center tw-rounded-full tw-pb-xs tw-mb-xs tw-bottom-0',
              {
                'tw-text-red-500':
                  value.length > limit - triggerCounterLimitOffset,
              }
            )}
          >
            <div className="tw-font-sans tw-text-xs tw-font-medium ">
              {limit - value.length}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default TextareaWithLimit;
