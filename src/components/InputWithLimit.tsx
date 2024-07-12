import {
  forwardRef,
  useState,
} from 'react';

import clsx from 'clsx';

import { cn } from '@/utils/shadcn-ui-utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  limit?: number;
  triggerCounterLimitOffset?: number;
};

const InputWithLimit = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, limit, triggerCounterLimitOffset = 10, ...props },
    ref
  ) => {
    const [value, setValue] = useState(
      ((props.defaultValue || props.value) as string) || ''
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    return (
      <div className="tw-relative">
        <input
          type={type}
          className={cn(
            'tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-input tw-bg-background tw-px-3 tw-py-2 tw-text-sm tw-ring-offset-background file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-muted-foreground focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50',
            className
          )}
          ref={ref}
          {...props}
          onChange={(value) => {
            handleChange(value);
            props?.onChange?.(value);
          }}
        />
        {limit && value.length >= limit - triggerCounterLimitOffset && (
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
              {value.length}/{limit}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default InputWithLimit;
