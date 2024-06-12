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

import { cn } from '@/lib/utils';
import { rewriteCodeBlock } from '@/utils/code-block';
import { stripHtml } from '@/utils/utils';

import TooltipWrapper from './TooltipWrapper';

interface CodeBlockHeaderProps {
  container: {
    header: Element;
    preElement: Element;
    lang: string;
    lineCount: number;
  };
  index: number;
  blockStates: {
    isCollapsed: boolean;
    isCopied: boolean;
    isWrapped: boolean;
    isShownLineNumbers: boolean;
  }[];
  setBlockStates: (callback: (draft: any) => void) => void;
  buttonTextStates: ReactNode[];
  setButtonTextStates: (callback: (draft: any) => void) => void;
  handleSelectForCompare: (index: number) => void;
  diffTexts: number[];
  idleCopyButtonText: ReactNode;
}

const CodeBlockHeader: React.FC<CodeBlockHeaderProps> = ({
  container,
  index,
  blockStates,
  setBlockStates,
  buttonTextStates,
  setButtonTextStates,
  handleSelectForCompare,
  diffTexts,
  idleCopyButtonText,
}) => {
  return (
    <div className="tw-p-2 tw-px-3 tw-flex tw-items-center tw-bg-[#1d1f21] tw-font-sans">
      <div className="tw-text-background dark:tw-text-foreground">
        {container.lang || 'plain-text'} ({container.lineCount} lines)
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
              rewriteCodeBlock(container.preElement);

              const isShownLineNumbers = blockStates[index]?.isShownLineNumbers;
              $(container.header)
                .parent()
                .find('code>code')
                .toggleClass('line', !isShownLineNumbers);
              setBlockStates((draft) => {
                draft[index].isShownLineNumbers = !isShownLineNumbers;
              });
            }}
          >
            <ListOrdered className="tw-w-4 tw-h-4" />
          </div>
        </TooltipWrapper>
        <TooltipWrapper
          content={blockStates[index]?.isWrapped ? 'Unwrap' : 'Wrap'}
        >
          <div
            className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
            onClick={() => {
              const isWrapped = blockStates[index]?.isWrapped;
              $(container.header)
                .parent()
                .find('pre code:first')
                .toggleClass(
                  'tw-whitespace-pre-wrap tw-break-words',
                  !isWrapped
                );
              setBlockStates((draft) => {
                draft[index].isWrapped = !isWrapped;
              });
            }}
          >
            {blockStates[index]?.isWrapped ? (
              <Text className="tw-w-4 tw-h-4" />
            ) : (
              <WrapText className="tw-w-4 tw-h-4" />
            )}
          </div>
        </TooltipWrapper>
        <TooltipWrapper
          content={blockStates[index]?.isCollapsed ? 'Expand' : 'Collapse'}
        >
          <div
            className="tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95"
            onClick={() => {
              const isCollapsed = blockStates[index]?.isCollapsed;
              $(container.header)
                .parent()
                .find('pre')
                .toggleClass('tw-max-h-[300px] tw-overflow-auto', !isCollapsed);
              setBlockStates((draft) => {
                draft[index].isCollapsed = !isCollapsed;
              });
            }}
          >
            {blockStates[index]?.isCollapsed ? (
              <Maximize2 className="tw-w-4 tw-h-4" />
            ) : (
              <Minimize2 className="tw-w-4 tw-h-4" />
            )}
          </div>
        </TooltipWrapper>
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
      </div>
    </div>
  );
};

export default CodeBlockHeader;
