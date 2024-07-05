import clsx from 'clsx';
import {
  Cpu,
  Image,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ui } from '@/utils/ui';

import TooltipWrapper from '../Tooltip';

type ModelItem = {
  label: string;
  shortLabel: string;
  code: string;
  icon: React.ReactNode;
  tooltip?: any;
};

type ModelSelectorProps<T extends ModelItem> = {
  type: 'language' | 'image';
  items: T[];
  onValueChange?: (value: T['code']) => void;
  value?: T['code'];
};

export default function ModelSelector<T extends ModelItem>({
  type,
  items,
  onValueChange,
  value,
}: ModelSelectorProps<T>) {
  return (
    <>
      <Select
        value={value}
        onValueChange={(value: T['code']) => {
          onValueChange?.(value);

          setTimeout(() => {
            ui.findActiveQueryBoxTextarea({}).trigger('focus');
          }, 100);
        }}
      >
        <TooltipWrapper
          content={`Choose ${type} model`}
          contentOptions={{
            sideOffset: 8,
          }}
        >
          <SelectTrigger
            variant="ghost"
            className="tw-font-medium tw-min-h-8 !tw-py-0 tw-flex tw-justify-center tw-items-center tw-gap-2 !tw-w-fit tw-max-w-[150px] tw-select-none active:!tw-scale-95 [&_span]:tw-max-w-[100px] !tw-px-2 tw-animate-in tw-zoom-in tw-transition-all tw-duration-300"
          >
            {type === 'language' ? (
              <Cpu className="tw-w-4 tw-h-4" />
            ) : (
              <Image className="tw-w-4 tw-h-4" />
            )}
            <SelectValue>
              {items.find((model) => model.code === value)?.shortLabel}
            </SelectValue>
            <span className="tw-text-accent-foreground tw-text-[.5rem] !tw-self-start">
              {items.find((model) => model.code === value)?.tooltip}
            </span>
          </SelectTrigger>
        </TooltipWrapper>
        <SelectContent
          position="popper"
          className="tw-font-sans [&_span]:tw-truncate tw-max-w-[200px] tw-max-h-[500px]"
          onCloseAutoFocus={(e: Event) => {
            e.preventDefault();
          }}
        >
          {items.map((model) => (
            <TooltipWrapper
              content={value !== model.code ? model.tooltip : undefined}
              contentOptions={{
                side: 'right',
                sideOffset: 10,
              }}
              key={model.code}
            >
              <SelectItem
                key={model.code}
                value={model.code}
                className={clsx({
                  'tw-text-accent-foreground': model.code === value,
                })}
              >
                <div className="tw-flex tw-items-center tw-justify-around gap-2">
                  {model.icon ? (
                    <div className="tw-text-[1.1rem]">{model.icon}</div>
                  ) : (
                    <Cpu className="tw-w-4 tw-h-4" />
                  )}
                  <span>{model.label}</span>
                </div>
              </SelectItem>
            </TooltipWrapper>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
