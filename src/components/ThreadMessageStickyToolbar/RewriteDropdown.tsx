import { useCallback, useRef } from 'react';

import $ from 'jquery';
import { RefreshCcw, Sparkles } from 'lucide-react';

import { languageModels } from '@/consts/ai-models';
import webpageMessageInterceptors from '@/content-script/main-world/message-interceptors';
import { queryBoxStore } from '@/content-script/session-store/query-box';
import { LanguageModel } from '@/types/ModelSelector';
import { sleep } from '@/utils/utils';

import useCtrlDown from '../hooks/useCtrlDown';
import Tooltip from '../Tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Container } from './ThreadMessageStickyHeader';

type RewriteDropdownProps = {
  container: Container;
};

export default function RewriteDropdown({ container }: RewriteDropdownProps) {
  const stopOnGoingInterceptor = useRef<() => void>();

  const ctrlDown = useCtrlDown();

  const handleRewrite = useCallback(
    async ({
      model,
      proSearch,
    }: {
      model?: LanguageModel['code'];
      proSearch?: boolean;
    }) => {
      stopOnGoingInterceptor.current?.();

      stopOnGoingInterceptor.current =
        webpageMessageInterceptors.alterNextQuery({
          languageModel:
            model || queryBoxStore.getState().selectedLanguageModel,
          proSearchState: proSearch,
        });

      const $buttonBar = $(container.messageBlock).find(
        '.mt-sm.flex.items-center.justify-between'
      );

      const $rewriteButton = $buttonBar
        .children()
        .first()
        .children()
        .find('button:contains("Rewrite")');

      if (!$rewriteButton.length) return;

      $rewriteButton.trigger('click');

      while (
        !$(`[data-popper-reference-hidden="true"]:contains("Sonar Large 32K")`)
          .length
      ) {
        await sleep(10);
      }

      $(
        `[data-popper-reference-hidden="true"] .md\\:h-full:contains("Sonar Large 32K")`
      )
        .last()
        .trigger('click');
    },
    [container.messageBlock, stopOnGoingInterceptor]
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        onClick={(e) => {
          if (ctrlDown) {
            e.preventDefault();
            handleRewrite({});
          }
        }}
      >
        <Tooltip content="Rewrite Message">
          <div
            className="tw-text-secondary-foreground tw-cursor-pointer tw-transition-all tw-animate-in tw-fade-in active:tw-scale-95 hover:tw-bg-secondary tw-rounded-md tw-p-1 tw-group"
            onClick={() => {}}
          >
            <RefreshCcw className="tw-w-4 tw-h-4 tw-text-muted-foreground group-hover:tw-text-foreground tw-transition-all" />
          </div>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="tw-flex tw-gap-2 tw-items-center"
          onSelect={() => {
            handleRewrite({
              proSearch: true,
              model: queryBoxStore.getState().selectedLanguageModel,
            });
          }}
        >
          <Sparkles className="tw-w-4 tw-h-4" />
          Pro Search
        </DropdownMenuItem>

        {languageModels.map((model) => (
          <DropdownMenuItem
            key={model.code}
            onSelect={() => {
              handleRewrite({
                model: model.code,
              });
            }}
            className="tw-flex tw-gap-2 tw-items-center"
          >
            {model.icon}
            {model.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
