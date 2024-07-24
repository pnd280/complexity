import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";
import $ from "jquery";
import { RefreshCcw } from "lucide-react";
import { useCallback, useRef } from "react";

import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import { queryBoxStore } from "@/content-script/session-store/query-box";
import ProSearchIcon from "@/shared/components/ProSearchIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn/ui/dropdown-menu";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import { sleep } from "@/utils/utils";

import { groupedLanguageModelsByProvider, LanguageModel } from "../QueryBox";

import { Container } from "./ThreadMessageStickyToolbar";

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
      model?: LanguageModel["code"];
      proSearch?: boolean;
    }) => {
      stopOnGoingInterceptor.current?.();

      stopOnGoingInterceptor.current = WebpageMessageInterceptor.alterNextQuery(
        {
          languageModel:
            model || queryBoxStore.getState().selectedLanguageModel,
          proSearchState: proSearch,
        },
      );

      const $buttonBar = $(container.messageBlock).find(
        ".mt-sm.flex.items-center.justify-between",
      );

      const $rewriteButton = $buttonBar
        .children()
        .first()
        .children()
        .find('button:contains("Rewrite")');

      if (!$rewriteButton.length) return;

      $rewriteButton.trigger("click");

      while (
        !$(`[data-popper-reference-hidden="true"]:contains("Sonar Large 32K")`)
          .length
      ) {
        await sleep(10);
      }

      $(
        `[data-popper-reference-hidden="true"] .md\\:h-full:contains("Sonar Large 32K")`,
      )
        .last()
        .trigger("click");
    },
    [container.messageBlock, stopOnGoingInterceptor],
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
          <div className="tw-group tw-cursor-pointer tw-rounded-md tw-p-1 tw-text-secondary-foreground tw-transition-all tw-animate-in tw-fade-in hover:tw-bg-secondary active:tw-scale-95">
            <RefreshCcw className="tw-size-4 tw-text-muted-foreground tw-transition-all group-hover:tw-text-foreground" />
          </div>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="custom-scrollbar tw-max-h-[300px] tw-overflow-auto">
          <DropdownMenuItem
            className="tw-flex tw-items-center tw-gap-2"
            onSelect={() => {
              handleRewrite({
                proSearch: true,
                model: queryBoxStore.getState().selectedLanguageModel,
              });
            }}
          >
            <ProSearchIcon className="tw-size-4" />
            Pro Search
          </DropdownMenuItem>
          {groupedLanguageModelsByProvider.map(([provider, models]) => (
            <DropdownMenuGroup key={provider}>
              <DropdownMenuLabel className="tw-py-1.5 tw-pl-2 tw-pr-2 tw-text-sm tw-text-muted-foreground">
                {provider}
              </DropdownMenuLabel>
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.code}
                  className="tw-flex tw-items-center tw-gap-2"
                  onSelect={() => {
                    handleRewrite({
                      model: model.code,
                    });
                  }}
                >
                  {model.icon}
                  {model.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}