import { ReactNode } from 'react';

import $ from 'jquery';
import {
  Check,
  GitCompare,
  ListOrdered,
  Maximize2,
  Minimize2,
  Text,
  WrapText,
} from 'lucide-react';
import { FaProjectDiagram } from 'react-icons/fa';

import { cn } from '@/lib/utils';
import { rewriteMarkdownBlock } from '@/utils/markdown-block';
import { ui } from '@/utils/ui';
import { stripHtml } from '@/utils/utils';

import TooltipWrapper from '../TooltipWrapper';
import useArtifactsSettings from './Artifacts/hooks/useArtifactsSettings';
import { MarkdownBlockStates } from './MarkdownBlockHeader';

type MarkdownBlockToolbarProps = {
  container: {
    header: Element;
    preElement: Element;
    lang: string;
    lineCount: number;
  };
  index: number;
  blocksStates: MarkdownBlockStates[];
  setBlocksStates: (callback: (draft: any) => void) => void;
  buttonTextStates: ReactNode[];
  setButtonTextStates: (callback: (draft: any) => void) => void;
  handleSelectForCompare: (index: number) => void;
  diffTexts: number[];
  idleCopyButtonText: ReactNode;
};

export default function MarkdownBlockToolbar({
  container,
  index,
  blocksStates,
  setBlocksStates,
  buttonTextStates,
  setButtonTextStates,
  handleSelectForCompare,
  diffTexts,
  idleCopyButtonText,
}: MarkdownBlockToolbarProps) {
  const artifactsSettings = useArtifactsSettings();

  return (
    <div className="tw-p-2 tw-px-3 tw-flex tw-items-center tw-bg-[#1d1f21] tw-font-sans">
      <div className="tw-text-background dark:tw-text-foreground">
        {container.lang || 'plain-text'}{' '}
        {blocksStates[index].isArtifact ? (
          <span className="tw-text-accent-foreground">Artifact ✨</span>
        ) : null}{' '}
        ({container.lineCount} lines)
      </div>
      <div className="tw-ml-auto tw-flex tw-gap-3">
        <TooltipWrapper content="Select for Compare">
          <div
            className={cn(
              'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95',
              {
                '!tw-text-background dark:!tw-text-accent-foreground':
                  diffTexts.includes(index),
              }
            )}
            onClick={() => {
              handleSelectForCompare(index);
            }}
          >
            <GitCompare className="tw-w-4 tw-h-4" />
          </div>
        </TooltipWrapper>
        <TooltipWrapper content="Toggle line numbers">
          <div
            className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
            onClick={() => {
              rewriteMarkdownBlock(container.preElement);

              const isShownLineNumbers =
                blocksStates[index]?.isShownLineNumbers;
              $(container.header)
                .parent()
                .find('code>code')
                .toggleClass('line', !isShownLineNumbers);
              setBlocksStates((draft) => {
                draft[index].isShownLineNumbers = !isShownLineNumbers;
              });
            }}
          >
            <ListOrdered className="tw-w-4 tw-h-4" />
          </div>
        </TooltipWrapper>

        {(blocksStates[index].isWrapped ||
          ui.isChildOverflowing({
            parent: $(container.preElement)[0],
            child: $(container.preElement).find('code:first')[0],
          }).isXOverflowing) && (
          <TooltipWrapper
            content={blocksStates[index]?.isWrapped ? 'Unwrap' : 'Wrap'}
          >
            <div
              className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
              onClick={() => {
                const isWrapped = blocksStates[index]?.isWrapped;
                $(container.header)
                  .parent()
                  .find('pre code:first')
                  .toggleClass(
                    '!tw-whitespace-pre-wrap !tw-break-words',
                    !isWrapped
                  );
                setBlocksStates((draft) => {
                  draft[index].isWrapped = !isWrapped;
                });
              }}
            >
              {blocksStates[index]?.isWrapped ? (
                <Text className="tw-w-4 tw-h-4" />
              ) : (
                <WrapText className="tw-w-4 tw-h-4" />
              )}
            </div>
          </TooltipWrapper>
        )}

        {(blocksStates[index].isCollapsed ||
          ($(container.preElement)?.outerHeight() || 0) > 300) && (
          <TooltipWrapper
            content={blocksStates[index]?.isCollapsed ? 'Expand' : 'Collapse'}
          >
            <div
              className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
              onClick={() => {
                const isCollapsed = blocksStates[index]?.isCollapsed;
                $(container.header)
                  .parent()
                  .find('pre')
                  .toggleClass('!tw-h-[300px] !tw-overflow-auto', !isCollapsed);
                setBlocksStates((draft) => {
                  draft[index].isCollapsed = !isCollapsed;
                });
              }}
            >
              {blocksStates[index]?.isCollapsed ? (
                <Maximize2 className="tw-w-4 tw-h-4" />
              ) : (
                <Minimize2 className="tw-w-4 tw-h-4" />
              )}
            </div>
          </TooltipWrapper>
        )}

        <div
          className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
          onClick={() => {
            $(container.preElement).parent().find('button').trigger('click');

            if (
              $(container.preElement).parents().eq(1).attr('id') ===
              'markdown-query-wrapper'
            ) {
              navigator.clipboard.writeText(
                stripHtml($(container.preElement).find('code:first').text())
              );
            }

            setButtonTextStates((draft) => {
              draft[index] = <Check className="tw-w-4 tw-h-4" />;
            });
            setTimeout(() => {
              setButtonTextStates((draft) => {
                draft[index] = idleCopyButtonText;
              });
            }, 2000);
          }}
        >
          {buttonTextStates[index]}
        </div>

        {artifactsSettings &&
          artifactsSettings.mermaid &&
          container.lang === 'mermaid' && (
            <TooltipWrapper content="Render">
              <div
                className={cn(
                  'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95'
                )}
                onClick={() => {
                  $(container.preElement)
                    .closest('.markdown-block-wrapper')
                    .nextUntil('.artifact-wrapper')
                    .next()
                    .removeClass('!tw-hidden');

                  $(container.preElement)
                    .closest('.markdown-block-wrapper')
                    .addClass('!tw-hidden');
                }}
              >
                <FaProjectDiagram className="tw-w-4 tw-h-4" />
              </div>
            </TooltipWrapper>
          )}
      </div>
    </div>
  );
}
