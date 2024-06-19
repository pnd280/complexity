import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';
import { CommandEmpty } from 'cmdk';
import $ from 'jquery';

import observer from '@/utils/observer';
import pplxApi from '@/utils/pplx-api';
import { ui } from '@/utils/ui';
import { useQuery } from '@tanstack/react-query';
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

  const handleSetVisible = useCallback(
    (state?: boolean) => {
      toggleVisibility(state);
      $('html').toggleClass('!tw-overflow-y-hidden', state);
    },
    [toggleVisibility]
  );

  const dispatchKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (visible) {
        commanderRef.current?.dispatchEvent(new KeyboardEvent('keydown', e));
      }
    },
    [visible, commanderRef]
  );

  const isInterceptableNavigationKey = useCallback(
    (e: JQuery.TriggeredEvent) =>
      (e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'Enter' ||
        e.key === 'Escape') &&
      visible,
    [visible]
  );

  const postSelection = ({
    textarea,
    newText,
    start,
  }: {
    textarea: HTMLTextAreaElement;
    newText: string;
    start: number;
  }) => {
    ui.setReactTextareaValue(textarea as HTMLTextAreaElement, newText);
    textarea.setSelectionRange(start, start);
    handleSetVisible(false);
    ui.findActiveQueryBoxTextarea({})?.trigger('focus');
  };

  useEffect(() => {
    !value.trim().length && handleSetVisible(false);
  }, [value, handleSetVisible]);

  useEffect(() => {
    const textarea = $textarea[0];

    const down = (e: JQuery.TriggeredEvent) => {
      const { word: wordAtCaret } = ui.getWordOnCaret(textarea);

      if (wordAtCaret.trim().length < 1) {
        handleSetVisible(false);
        return;
      }

      if (isInterceptableNavigationKey(e)) {
        if (e.key === 'Escape') {
          return handleSetVisible(false);
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

    $(textarea).on('blur', (e) => {
      if (e.relatedTarget === commanderRef.current) return;

      handleSetVisible(false);
    });

    $(document).on('click', (e) => {
      if (textarea.contains(e.target)) return;

      handleSetVisible(false);
    });

    return () => {
      $(textarea).off('keydown');
    };
  }, [
    $textarea,
    visible,
    searchValue,
    dispatchKeydown,
    setQuickCommandSearchValue,
    handleSetVisible,
    isInterceptableNavigationKey,
  ]);

  const { refetch: refetchThreadInfo } = useQuery({
    queryKey: ['currentThreadInfo'],
    queryFn: () =>
      pplxApi.fetchThreadInfo(window.location.pathname.split('/').pop() || ''),
    enabled: window.location.pathname.includes('/search/'),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    observer.onShallowRouteChange(() => {
      if (!window.location.pathname.includes('/search/')) return;
      refetchThreadInfo();
    });
  }, [refetchThreadInfo]);

  return (
    <Command
      className={clsx(
        '!tw-absolute tw-rounded-lg tw-border tw-shadow-md tw-w-max tw-h-max tw-z-30 tw-animate-in tw-fade-in tw-max-h-[200px] !tw-outline-none tw-font-sans',
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
      }}
      value={value}
    >
      <div className="tw-hidden">
        <CommandInput value={searchValue} />
      </div>
      <CommandList>
        <CommandEmpty className="tw-text-center tw-text-muted-foreground tw-font-sans tw-text-sm tw-p-2">
          No results found.
        </CommandEmpty>
        {!searchValue &&
          quickQueryParams.map((param) => (
            <CommandItem key={param.type}>
              <div className="tw-flex tw-items-center tw-gap-2">
                {param.heading}
                <KeyCombo keys={[param.prefix]} />
              </div>
            </CommandItem>
          ))}
        {searchValue &&
          sortedQuickQueryParams.map((param) => {
            return (
              <Fragment key={param.type}>
                <CommandGroup
                  heading={
                    <div className="tw-flex tw-gap-2 tw-items-center tw-text-accent-foreground">
                      {param.heading}
                      <KeyCombo keys={[param.prefix]} />
                    </div>
                  }
                >
                  {param.optionItems
                    .filter((optionItem) => !optionItem.disabled)
                    .map((optionItem) => (
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
                          onSelect={() => {
                            const { newText, start } = ui.getWordOnCaret(
                              $textarea[0]
                            );

                            postSelection({
                              textarea: $textarea[0],
                              newText,
                              start,
                            });

                            optionItem.onSelect();
                            handleSetVisible(false);
                          }}
                        >
                          <div className="tw-flex tw-gap-2 tw-min-w-max">
                            <div className="tw-h-4 tw-w-4 tw-flex tw-items-center">
                              {optionItem.icon}
                            </div>
                            <div>{optionItem.label}</div>
                          </div>
                          {optionItem.hint && (
                            <div className="tw-ml-2 tw-text-xs tw-text-muted-foreground tw-truncate tw-max-w-[500px]">
                              {optionItem.hint}
                            </div>
                          )}
                        </CommandItem>
                      </div>
                    ))}
                </CommandGroup>
              </Fragment>
            );
          })}
      </CommandList>
    </Command>
  );
}
