import {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import clsx from 'clsx';
import $ from 'jquery';
import {
  BadgePercent,
  Cpu,
  Library,
} from 'lucide-react';
import {
  PiGlobe,
  PiGlobeX,
} from 'react-icons/pi';
import {
  SiReddit,
  SiWikipedia,
  SiYoutube,
} from 'react-icons/si';

import { queryBoxStore } from '@/content-script/session-store/query-box';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import { chromeStorage } from '@/utils/chrome-store';
import { ui } from '@/utils/ui';
import { WSMessageParser } from '@/utils/ws';
import { SelectLabel } from '@radix-ui/react-select';
import { useToggle } from '@uidotdev/usehooks';

import LabeledSwitch from '../LabeledSwitch';
import TooltipWrapper from '../TooltipWrapper';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '../ui/select';

const webAccessFocus = [
  {
    label: 'All',
    code: 'internet',
    icon: <PiGlobe className="tw-text-[1rem]" />,
  },
  {
    label: 'Wikipedia',
    code: 'wikipedia',
    icon: <SiWikipedia className="tw-text-[1rem]" />,
  },
  {
    label: 'Academic',
    code: 'scholar',
    icon: <Library className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Wolfram|Alpha',
    code: 'wolfram',
    icon: <BadgePercent className="tw-w-4 tw-h-4" />,
  },
  {
    label: 'Youtube',
    code: 'youtube',
    icon: <SiYoutube className="tw-text-[1rem]" />,
  },
  {
    label: 'Reddit',
    code: 'reddit',
    icon: <SiReddit className="tw-text-[1rem]" />,
  },
] as const;

export type WebAccessFocus = (typeof webAccessFocus)[number] & {
  tooltip?: string;
};

export default function FocusSelector() {
  const items = useMemo(() => {
    return [...webAccessFocus] as WebAccessFocus[];
  }, []);

  const [open, toggleOpen] = useToggle(false);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    focus,
    setFocus,
    allowWebAccess,
    toggleWebAccess,
    proSearch,
    toggleProSearch,
  } = queryBoxStore((state) => state.webAccess);

  useEffect(() => {
    chromeStorage.setStorageValue({
      key: 'defaultFocus',
      value: focus,
    });
  }, [focus]);

  useEffect(() => {
    if (allowWebAccess && !focus) {
      setFocus('internet');
    }

    ui.findActiveQueryBoxTextarea().trigger('focus');

    chromeStorage.setStorageValue({
      key: 'defaultWebAccess',
      value: allowWebAccess,
    });
  }, [allowWebAccess]);

  $('body').toggleClass('pro-search', proSearch && allowWebAccess);

  useEffect(() => {
    proSearch && toggleWebAccess(true);
  }, [proSearch]);

  const saveProSearchState = async (checked: boolean) => {
    try {
      await webpageMessenger.sendMessage({
        event: 'sendWebsocketMessage',
        payload: WSMessageParser.stringify({
          messageCode: 423,
          event: 'save_user_settings',
          data: {
            default_copilot: checked,
          },
        }),
      });
    } catch (e) {
      alert('Failed to save pro search state.');
    }
  };

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
          contentClassName="tw-font-sans"
        >
          <SelectTrigger
            variant="ghost"
            className={clsx(
              'tw-font-medium !tw-py-0 tw-flex tw-justify-center tw-items-center gap-1 !tw-w-fit tw-max-w-[150px] tw-select-none active:!tw-scale-95 [&_span]:tw-max-w-[100px] !tw-px-2 tw-animate-in tw-zoom-in tw-transition-all tw-duration-300',
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
              ui.findActiveQueryBoxTextarea().trigger('focus');
            }, 100);
          }}
        >
          <SelectGroup>
            {items.map((model) => (
              <TooltipWrapper
                content={focus !== model.code ? model.tooltip : undefined}
                contentOptions={{
                  side: 'right',
                  sideOffset: 10,
                }}
                contentClassName="tw-font-sans"
                key={model.code}
              >
                <SelectItem
                  key={model.code}
                  value={model.code}
                  className={clsx({
                    'tw-text-accent-foreground': model.code === focus,
                  })}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  <div className="tw-flex tw-items-center tw-justify-around gap-2">
                    {model.icon ? (
                      <div>{model.icon}</div>
                    ) : (
                      <Cpu className="tw-w-4 tw-h-4" />
                    )}
                    <span>{model.label}</span>
                  </div>
                </SelectItem>
              </TooltipWrapper>
            ))}
            <SelectLabel className="tw-p-2">
              <LabeledSwitch
                label="Pro search"
                id="pro-search"
                onCheckedChange={(checked) => {
                  toggleProSearch(checked);

                  if (checked) {
                    toggleWebAccess(true);
                  }

                  saveProSearchState(checked);
                }}
                checked={proSearch}
              />
            </SelectLabel>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

export function isValidFocus(focus?: any): focus is WebAccessFocus['code'] {
  return webAccessFocus.some((model) => model.code === focus);
}
