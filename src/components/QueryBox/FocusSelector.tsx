import {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import clsx from 'clsx';
import { Cpu } from 'lucide-react';
import { PiGlobeX } from 'react-icons/pi';

import { webAccessFocus } from '@/consts/model-selector';
import { queryBoxStore } from '@/content-script/session-store/query-box';
import { WebAccessFocus } from '@/types/ModelSelector';
import { ui } from '@/utils/ui';
import { useToggle } from '@uidotdev/usehooks';

import TooltipWrapper from '../Tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '../ui/select';

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

    ui.findActiveQueryBoxTextarea({}).trigger('focus');
  }, [allowWebAccess, focus, setFocus]);

  return (
    <>
      <Select
        value={focus || ''}
        onValueChange={(value) => {
          setFocus(value as WebAccessFocus['code']);
          toggleWebAccess(true);
        }}
        open={open}
      >
        <TooltipWrapper
          content={`Web access: ${allowWebAccess ? 'ON' : 'OFF'}${allowWebAccess && focus ? ` | Focus: ${items.find((model) => model.code === focus)?.label}` : ''}`}
          contentOptions={{
            sideOffset: 8,
          }}
        >
          <SelectTrigger
            variant="ghost"
            className={clsx(
              'tw-font-medium !tw-py-0 tw-flex tw-justify-center tw-items-center gap-1 !tw-w-fit tw-max-w-[150px] tw-select-none active:!tw-scale-95 [&_span]:tw-max-w-[100px] !tw-px-2 tw-animate-in tw-zoom-in tw-transition-all tw-duration-300 tw-h-full',
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
            <div
              className={clsx({
                'tw-text-accent-foreground': allowWebAccess,
              })}
            >
              {allowWebAccess && focus ? (
                <div className="relative">
                  {items.find((model) => model.code === focus)?.icon}
                </div>
              ) : (
                <PiGlobeX className={clsx('tw-text-[1rem]')} />
              )}
            </div>
          </SelectTrigger>
        </TooltipWrapper>
        <SelectContent
          className="tw-font-sans [&_span]:tw-truncate tw-max-w-[200px] tw-max-h-[500px]"
          onCloseAutoFocus={(e: Event) => {
            e.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (
              triggerRef.current &&
              triggerRef.current.contains(event.target as Node)
            )
              return;

            toggleOpen(false);
            setTimeout(() => {
              ui.findActiveQueryBoxTextarea({}).trigger('focus');
            }, 100);
          }}
        >
          <SelectGroup>
            {items.map((item) => (
              <TooltipWrapper
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
                  className={clsx({
                    'tw-text-accent-foreground': item.code === focus,
                  })}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="tw-flex tw-items-center tw-justify-around gap-2">
                    {item.icon ? (
                      <div>{item.icon}</div>
                    ) : (
                      <Cpu className="tw-w-4 tw-h-4" />
                    )}
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              </TooltipWrapper>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
