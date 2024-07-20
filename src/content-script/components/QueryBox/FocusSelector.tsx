import { cn } from '@/utils/shadcn-ui-utils';
import { Cpu } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { PiGlobeX } from 'react-icons/pi';

import { queryBoxStore } from '@/content-script/session-store/query-box';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/shared/components/Select';
import { WebAccessFocus } from '@/types/ModelSelector';
import UIUtils from '@/utils/UI';
import { useToggle } from '@uidotdev/usehooks';

import Tooltip from '@/shared/components/Tooltip';
import { webAccessFocus } from './';

export default function FocusSelector() {
  const items = useMemo(() => {
    return [...webAccessFocus] as WebAccessFocus[];
  }, []);

  const [open, toggleOpen] = useToggle(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const { focus, setFocus, allowWebAccess, toggleWebAccess } = queryBoxStore(
    (state) => state.webAccess
  );

  useEffect(() => {
    if (allowWebAccess && !focus) {
      setFocus('internet');
    }

    UIUtils.getActiveQueryBoxTextarea({}).trigger('focus');
  }, [allowWebAccess, focus, setFocus]);

  return (
    <>
      <Select
        value={focus || ''}
        onValueChange={(value) => {
          setFocus(value as WebAccessFocus['code']);
          toggleWebAccess(true);
          toggleOpen();

          UIUtils.getActiveQueryBoxTextarea({}).trigger('focus');
        }}
        onPointerDownOutside={() => toggleOpen(false)}
        open={open}
      >
        <SelectTrigger
          variant="ghost"
          className={cn(
            'tw-font-medium !tw-py-0 tw-flex tw-justify-center tw-items-center gap-1 !tw-w-fit tw-max-w-[150px] tw-select-none active:!tw-scale-95 [&_span]:tw-max-w-[100px] tw-min-h-8 !tw-px-2 tw-animate-in tw-zoom-in tw-transition-all tw-duration-300 tw-h-full',
            {
              '!tw-bg-accent': allowWebAccess,
            }
          )}
          onContextMenu={(e) => {
            e.preventDefault();
            toggleOpen();
          }}
          onClick={() => {
            toggleWebAccess();
          }}
          ref={triggerRef}
        >
          <Tooltip
            content={`Web access: ${allowWebAccess ? 'ON' : 'OFF'}${allowWebAccess && focus ? ` | Focus: ${items.find((model) => model.code === focus)?.label}` : ''}`}
            contentOptions={{
              sideOffset: 15,
            }}
          >
            <div
              className={cn({
                'tw-text-accent-foreground': allowWebAccess,
              })}
            >
              {allowWebAccess && focus ? (
                <div className="relative">
                  {items.find((model) => model.code === focus)?.icon}
                </div>
              ) : (
                <PiGlobeX className="tw-text-[1rem]" />
              )}
            </div>
          </Tooltip>
        </SelectTrigger>
        <SelectContent className="tw-font-sans [&_span]:tw-truncate tw-max-w-[200px] tw-max-h-[500px]">
          <SelectGroup>
            {items.map((item) => (
              <Tooltip
                content={focus !== item.code ? item.tooltip : undefined}
                contentOptions={{
                  side: 'right',
                  sideOffset: 10,
                }}
                key={item.code}
              >
                <SelectItem
                  key={item.code}
                  value={item.code}
                  className={cn({
                    'tw-text-accent-foreground': item.code === focus,
                  })}
                >
                  <div className="tw-flex tw-items-center tw-justify-around gap-2">
                    {item.icon ? (
                      <div>{item.icon}</div>
                    ) : (
                      <Cpu className="tw-size-4" />
                    )}
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              </Tooltip>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
