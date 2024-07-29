import $ from "jquery";
import { RefreshCcw } from "lucide-react";
import { useCallback, useRef } from "react";

import {
  groupedLanguageModelsByProvider,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import { Container } from "@/content-script/components/ThreadMessageStickyToolbar/ThreadMessageStickyToolbar";
import WebpageMessageInterceptor from "@/content-script/main-world/WebpageMessageInterceptors";
import { queryBoxStore } from "@/content-script/session-store/query-box";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import ProSearchIcon from "@/shared/components/ProSearchIcon";
import Tooltip from "@/shared/components/Tooltip";
import useCtrlDown from "@/shared/hooks/useCtrlDown";
import { waitForElement } from "@/utils/utils";

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

      requestAnimationFrame(async () => {
        const viewportWidth = window.innerWidth;

        await waitForElement({
          selector() {
            if (viewportWidth && viewportWidth < 768) {
              return $(".duration-250.fill-mode-both.fixed.bottom-0.left-0")[0];
            }

            return $(
              `[data-popper-reference-hidden="true"]:contains("Pro Search")`,
            )[0];
          },
          timeout: 1000,
          interval: 100,
        });

        if (viewportWidth && viewportWidth < 768) {
          $(
            ".duration-250.fill-mode-both.fixed.bottom-0.left-0 .md\\:h-full:nth-of-type(2)",
          )
            .children()
            .last()
            .trigger("click");
        } else {
          $(`[data-popper-reference-hidden="true"] .md\\:h-full:nth-child(3)`)
            .children()
            .last()
            .trigger("click");
        }
      });
    },
    [container.messageBlock, stopOnGoingInterceptor],
  );

  return (
    <DropdownMenu
      positioning={{
        placement: "bottom",
      }}
    >
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
      <DropdownMenuContent className="custom-scrollbar tw-max-h-[300px] tw-overflow-y-auto">
        <DropdownMenuItem
          value="pro-search"
          className="tw-flex tw-items-center tw-gap-2"
          onClick={() => {
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
            {models.map((model) => (
              <DropdownMenuItem
                key={model.code}
                value={model.code}
                className="tw-flex tw-items-center tw-gap-2"
                onClick={() => {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
