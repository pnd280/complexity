import $ from 'jquery';
import { Check, CodeXml, Copy, LoaderCircle, X } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import useWaitForElement from '@/content-script/hooks/useWaitForElement';
import { webpageMessenger } from '@/content-script/main-world/webpage-messenger';
import { useCanvasStore } from '@/content-script/session-store/canvas';
import useToggleButtonText from '@/shared/hooks/useToggleButtonText';
import Canvas from '@/utils/Canvas';
import MarkdownBlockUtils from '@/utils/MarkdownBlock';
import { cn } from '@/utils/shadcn-ui-utils';
import UIUtils from '@/utils/UI';
import { scrollToElement } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery, useWindowScroll } from '@uidotdev/usehooks';

import { canvasComponents } from './';

export default function CanvasPanel() {
  const { isOpen, toggleOpen, metaData, setMetaData } = useCanvasStore();

  const [canvasComponent, setCanvasComponent] = useState<ReactNode>();

  const isFloat = useMediaQuery('(max-width: 1500px)');

  const { element: threadWrapper, isWaiting } = useWaitForElement({
    id: 'thread-wrapper',
    selector: () => UIUtils.getThreadWrapper()[0],
    timeout: 5000,
  });

  const checkIfCanvasIsOpen = useCallback(() => {
    const { preBlockId } = metaData || {};

    if (!preBlockId) return false;

    const $pre = $(`#${preBlockId}`);
    const lang = MarkdownBlockUtils.getLang($pre);
    if (!Canvas.isCanvasLang(lang)) return false;

    const code = MarkdownBlockUtils.extractCodeFromPreBlock($pre[0]);
    if (!code) return false;

    setCanvasComponent(canvasComponents[lang]);
    return true;
  }, [metaData]);

  const updateThreadWrapperClasses = useCallback(
    (isOpen: boolean) => {
      if (!threadWrapper) return;

      requestAnimationFrame(() => {
        $(threadWrapper)
          .children()
          .first()
          .children()
          .first()
          .toggleClass('max-w-threadWidth tw-mx-auto', isOpen);

        $(threadWrapper!).attr({
          'data-mask-panel-state': isOpen ? 'open' : 'closed',
        });

        $(threadWrapper).toggleClass(
          'tw-grid tw-grid-cols-2 tw-gap-8 !tw-max-w-[2500px]',
          isOpen && !isFloat
        );
      });
    },
    [isFloat, threadWrapper]
  );

  useEffect(() => {
    if (!threadWrapper || isWaiting) return;
    const localIsOpen = checkIfCanvasIsOpen();
    updateThreadWrapperClasses(localIsOpen);
    toggleOpen(localIsOpen);
  }, [
    checkIfCanvasIsOpen,
    isWaiting,
    threadWrapper,
    toggleOpen,
    updateThreadWrapperClasses,
  ]);

  useEffect(() => {
    return () => {
      setMetaData();
    };
  }, [setMetaData]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      toggleOpen(false);
    }
  };

  if (!threadWrapper || !isOpen) return null;

  return ReactDOM.createPortal(
    <div
      id="canvas-panel"
      className={cn(
        'tw-bg-accent tw-top-[5rem] tw-border tw-rounded-md tw-overflow-hidden tw-flex-col tw-flex',
        'tw-animate-in tw-slide-in-from-right tw-fade-in',
        {
          'tw-sticky': !isFloat,
          'tw-fixed tw-right-8 tw-w-[80%] tw-z-[20] tw-shadow-lg': isFloat,
        }
      )}
      onAnimationEnd={handleAnimationEnd}
      style={{
        height: `calc(100vh - ${UIUtils.getStickyNavbar().outerHeight()}px - 3rem)`,
      }}
    >
      <div className="tw-size-full tw-relative">
        <div className="tw-absolute tw-inset-2 tw-size-max tw-z-10">
          <CanvasOptions />
        </div>
        <div className="tw-absolute tw-top-2 tw-left-1/2 -tw-translate-x-1/2 tw-size-max tw-z-10">
          <JumpToSource />
        </div>
        <div className="tw-absolute tw-top-2 tw-right-2 tw-size-max tw-z-10">
          <CloseButton />
        </div>
        <div id="complexity-canvas" className="tw-size-full" />
        {canvasComponent}
        <Code />
      </div>
    </div>,
    threadWrapper
  );
}

function Code() {
  const { showCode, metaData } = useCanvasStore();

  const {
    data: highlightedCode,
    refetch,
    isFetching: isFetchingHighlightedCode,
  } = useQuery({
    queryKey: ['canvasHighlightedCode'],
    queryFn: async () => {
      const highligtedCode = await webpageMessenger.sendMessage({
        event: 'getHighlightedCodeAsHtml',
        payload: {
          code: metaData!.content,
          lang: MarkdownBlockUtils.getLang($(`pre#${metaData!.preBlockId}`)),
        },
        timeout: 5000,
      });

      if (!highligtedCode) return;

      return highligtedCode;
    },
    enabled: !!metaData?.content,
    select(data) {
      if (!data) return;

      return $(data).find('code').html();
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [metaData, refetch]);

  if (!showCode || !metaData) return null;

  return (
    <div className="tw-absolute tw-inset-0 tw-bg-secondary tw-size-full tw-overflow-auto">
      {isFetchingHighlightedCode || !highlightedCode ? (
        <div className="tw-size-full tw-flex tw-items-center tw-justify-center">
          <LoaderCircle className="tw-size-8 tw-animate-spin" />
        </div>
      ) : (
        <pre className="tw-font-mono tw-p-4 tw-pt-[4rem] line-numbers">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode || '' }} />
        </pre>
      )}
    </div>
  );
}

function CanvasOptions() {
  const { metaData, showCode, toggleShowCode } = useCanvasStore(
    (state) => state
  );

  const [copyButtonText, setCopyButtonText] = useToggleButtonText({
    defaultText: <Copy className="tw-size-4" />,
  });

  if (!metaData) return null;

  return (
    <div className="tw-flex tw-items-center">
      <div className="tw-flex tw-text-xs tw-bg-background tw-font-sans tw-p-1 tw-rounded-lg tw-m-2">
        <div
          className={cn(
            'tw-p-1 tw-px-2 tw-rounded-md tw-cursor-pointer tw-select-none tw-transition-all',
            {
              'tw-bg-accent': !showCode,
            }
          )}
          onClick={() => toggleShowCode()}
        >
          Preview
        </div>
        <div
          className={cn(
            'tw-flex tw-gap-1 tw-items-center tw-p-1 tw-px-2 tw-rounded-md tw-cursor-pointer tw-select-none tw-transition-all',
            {
              'tw-bg-accent': showCode,
            }
          )}
          onClick={() => toggleShowCode()}
        >
          <CodeXml className="tw-size-3" />
          <span className="tw-leading-none">Code</span>
        </div>
      </div>
      {showCode && (
        <div
          className="tw-p-2 tw-rounded-md tw-h-fit hover:tw-bg-background tw-cursor-pointer active:tw-scale-95 tw-transition-all tw-animate-in tw-fade-in"
          onClick={() => {
            navigator.clipboard.writeText(metaData.content);

            setCopyButtonText(<Check className="tw-size-4" />);
          }}
        >
          {copyButtonText}
        </div>
      )}
    </div>
  );
}

function JumpToSource() {
  const [{ y }] = useWindowScroll();
  const [prevY, setPrevY] = useState<number | null>(null);

  const { metaData } = useCanvasStore();

  const [buttonText, setCopyButtonText] = useToggleButtonText({
    defaultText: 'Jump to source',
  });

  useEffect(() => {
    if (metaData) {
      setPrevY(y);
    }
  }, [y, metaData]);

  useEffect(() => {
    if (metaData) {
      setPrevY(null);
    }
  }, [metaData]);

  const ref = useRef<HTMLDivElement>(null);

  if (!metaData || prevY === null) return null;

  return (
    <div
      ref={ref}
      className="tw-cursor-pointer tw-text-sm tw-p-1 tw-text-muted-foreground hover:tw-text-foreground active:tw-scale-95 tw-transition-all tw-duration-300 tw-animate-in tw-fade-in tw-font-sans"
      onClick={() => {
        const $preBlock = $(`#${metaData.preBlockId}`);

        if (
          !$preBlock.length ||
          MarkdownBlockUtils.extractCodeFromPreBlock($preBlock[0]) !==
            metaData.content
        ) {
          setCopyButtonText('The block no longer exists');
          return;
        }

        scrollToElement($preBlock, -100, 200);

        setTimeout(() => {
          setPrevY(null);
        }, 250);
      }}
    >
      {buttonText}
    </div>
  );
}

function CloseButton() {
  const { toggleOpen, setMetaData } = useCanvasStore();

  return (
    <div
      className="tw-cursor-pointer tw-p-1 hover:tw-bg-background tw-rounded-md tw-text-muted-foreground hover:tw-text-foreground active:tw-scale-95 tw-transition-all tw-duration-300"
      onClick={() => {
        toggleOpen(false);
        setMetaData();
      }}
    >
      <X className="tw-size-4" />
    </div>
  );
}
