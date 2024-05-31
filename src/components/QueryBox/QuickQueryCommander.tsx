import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import $ from 'jquery';

import { ui } from '@/utils/ui';
import {
  useToggle,
  useWindowSize,
} from '@uidotdev/usehooks';

import { KeyCombo } from '../Commander';
import useQuickQueryCommanderParams
  from '../hooks/useQuickQueryCommanderParams';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';

export type QuickCommanderProps = {
  context: 'main' | 'follow-up';
  $trigger: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLTextAreaElement>;
  searchValue?: string;
  setQuickCommandSearchValue: (value: string) => void;
};

export default function QuickQueryCommander({
  context,
  $trigger,
  $textarea,
  searchValue,
  setQuickCommandSearchValue,
}: QuickCommanderProps) {
  useWindowSize();

  const commanderRef = useRef<HTMLDivElement>(null);

  const [visible, toggleVisibility] = useToggle(false);
  const { quickQueryParams } = useQuickQueryCommanderParams({
    context,
  });
  const [value, setValue] = useState('');

  const sortedQuickQueryParams = useMemo(() => {
    const top = quickQueryParams.find((param) =>
      ('@' + searchValue).startsWith(param.prefix)
    );

    if (top) {
      return [top, ...quickQueryParams.filter((param) => param !== top)];
    }

    return quickQueryParams;
  }, [quickQueryParams, searchValue]);

  const setPos = () => {
    if (commanderRef.current) {
      commanderRef.current.style.bottom =
        window.innerHeight -
        Math.round($trigger?.offset()?.top || 0) +
        5 +
        'px';
      commanderRef.current.style.left = $trigger?.offset()?.left + 'px';
      commanderRef.current.style.width =
        Math.round($trigger.outerWidth()!) + 'px';
    }
  };

  visible && setPos();

  const handleSetVisible = (state?: boolean) => {
    toggleVisibility(state);

    $('html').toggleClass('!tw-overflow-y-hidden', state);
  };

  const dispatchKeydown = (e: KeyboardEvent) => {
    if (visible) {
      commanderRef.current?.dispatchEvent(new KeyboardEvent('keydown', e));
    }
  };

  const isInterceptableNavigationKey = (e: JQuery.TriggeredEvent) =>
    (e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Enter' ||
      e.key === 'Escape') &&
    visible;

  useEffect(() => {
    !value && handleSetVisible(false);
  }, [value]);

  useEffect(() => {
    const textarea = $textarea[0];

    const down = (e: JQuery.TriggeredEvent) => {
      const { word: wordAtCaret, newText, start } = ui.getWordOnCaret(textarea);

      if (wordAtCaret.trim().length < 1) {
        handleSetVisible(false);
        return;
      }

      if (isInterceptableNavigationKey(e)) {
        if (e.key === 'Escape') {
          return handleSetVisible(false);
        }

        if (e.key === 'Enter') {
          ui.setReactTextareaValue(textarea as HTMLTextAreaElement, newText);
          textarea.setSelectionRange(start, start);
          handleSetVisible(false);
        }

        return (
          e.originalEvent && dispatchKeydown(e.originalEvent as KeyboardEvent)
        );
      }

      if (
        (e.key === '@' || (e.ctrlKey && e.key === ' ')) &&
        wordAtCaret.startsWith('@')
      ) {
        handleSetVisible(true);
      }

      setQuickCommandSearchValue(wordAtCaret);
    };

    $(textarea).on('keydown', (e) => {
      if (isInterceptableNavigationKey(e)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      setTimeout(down.bind(null, e), 0);
    });

    $(textarea).on('blur', () => {
      handleSetVisible(false);
    });

    $(window).on('click.query-box-quick-commander', () => {
      handleSetVisible(false);
    });

    return () => {
      $(textarea).off('keydown');
      $(window).off('click.query-box-quick-commander');
    };
  }, [$textarea, value, visible]);

  return (
    <div>
      <Command
        className={clsx(
          '!tw-absolute tw-rounded-lg tw-border tw-shadow-md tw-w-max tw-h-max tw-z-30 tw-animate-in tw-fade-in tw-max-h-[200px] !tw-outline-none',
          {
            'tw-hidden': !visible,
          }
        )}
        id="quick-commander"
        ref={commanderRef}
        onValueChange={(value) => {
          if (!visible) {
            return;
          }
          setValue(value);
          console.log('value:', value);
        }}
        value={value}
      >
        <div className="tw-hidden">
          <CommandInput value={searchValue} />
        </div>
        <CommandList>
          {!searchValue &&
            quickQueryParams.map((param, index) => (
              <CommandItem key={param.type}>
                <div className="tw-flex tw-items-center tw-gap-2">
                  {param.heading}
                  <KeyCombo keys={[param.prefix]} />
                </div>
              </CommandItem>
            ))}
          {searchValue &&
            sortedQuickQueryParams.map((param, index) => {
              return (
                <Fragment key={param.type}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup
                    heading={
                      <div className="tw-flex tw-gap-2 tw-items-center">
                        {param.heading}
                        <KeyCombo keys={[param.prefix]} />
                      </div>
                    }
                  >
                    {param.optionItems.map((optionItem) => (
                      <div key={optionItem.value}>
                        <CommandItem
                          value={optionItem.value}
                          className="tw-flex tw-items-center"
                          keywords={[
                            param.prefix,
                            ...optionItem.keywords.map(
                              (keyword) => param.prefix + keyword
                            ),
                          ]}
                          onSelect={(value) => {
                            optionItem.onSelect();
                            handleSetVisible(false);
                          }}
                        >
                          <div className="tw-h-4 tw-w-4 tw-mr-2 tw-flex tw-items-center">
                            {optionItem.icon}
                          </div>
                          <div>{optionItem.label}</div>
                        </CommandItem>
                      </div>
                    ))}
                  </CommandGroup>
                </Fragment>
              );
            })}
        </CommandList>
      </Command>
    </div>
  );
}
