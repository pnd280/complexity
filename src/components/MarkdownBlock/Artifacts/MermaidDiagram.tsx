import {
  useEffect,
  useRef,
} from 'react';

import $ from 'jquery';
import {
  FileCode,
  LoaderCircle,
  RefreshCcw,
} from 'lucide-react';
import svgPanZoom from 'svg-pan-zoom';
import { Updater } from 'use-immer';

import TooltipWrapper from '@/components/TooltipWrapper';
import { useGlobalStore } from '@/content-script/session-store/global';
import { cn } from '@/lib/utils';
import mermaidUtils from '@/utils/mermaid-utils';
import observer from '@/utils/observer';
import { useToggle } from '@uidotdev/usehooks';

import { MarkdownBlockStates } from '../MarkdownBlockHeader';

export default function MermaidDiagram({
  pre,
  code,
  containerIndex,
  setBlocksStates,
}: {
  pre: Element;
  code: string;
  containerIndex: number;
  blockStates: MarkdownBlockStates;
  setBlocksStates: Updater<MarkdownBlockStates[]>;
}) {
  const [processed, setProcessed] = useToggle(false);

  const svgPanZoomRef = useRef<SvgPanZoom.Instance>();

  const enable = useGlobalStore((state) => state.artifacts.mermaid);

  useEffect(() => {
    if (!enable || processed) return;

    $(pre).closest('.markdown-block-wrapper').addClass('!tw-hidden');

    $(() => {
      requestAnimationFrame(async () => {
        await mermaidUtils.enqueue(
          `.mermaid-wrapper-${containerIndex} .mermaid-run`
        );

        observer.onElementExist({
          container: $(pre).closest('.markdown-block-wrapper').parent()[0],
          selector: () => [
            $(`.mermaid-wrapper-${containerIndex} .mermaid-run svg`)[0],
          ],
          callback: ({ element }) => {
            svgPanZoomRef.current = svgPanZoom(element as HTMLElement, {
              zoomScaleSensitivity: 0.4,
              center: true,
              fit: true,
              contain: true,
            });

            setProcessed(true);
          },
          recurring: false,
        });
      });
    });
  }, [pre, enable, containerIndex, processed, setBlocksStates, setProcessed]);

  useEffect(() => {}, []);

  return (
    <div
      className={cn(
        'tw-relative tw-h-[500px] tw-my-4 tw-block tw-border tw-border-border tw-rounded-md tw-select-none tw-animate-in tw-fade-in',
        {
          'artifact-processed': processed,
        }
      )}
    >
      {!processed && (
        <div className="tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
          <LoaderCircle className="tw-w-6 tw-h-6 tw-animate-spin" />
        </div>
      )}
      <div
        className={cn(
          'mermaid-run tw-h-full [&>svg]:!tw-flex-grow [&>svg]:!tw-max-w-full [&>svg]:!tw-h-full',
          {
            'tw-animate-in tw-fade-in': processed,
            'tw-opacity-0 tw-invisible': !processed,
          }
        )}
      >
        {code}
      </div>
      {processed && (
        <>
          <div className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-gap-2 tw-items-center">
            <TooltipWrapper content="View code">
              <div
                className={
                  'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-foreground tw-transition-all active:tw-scale-95'
                }
                onClick={() => {
                  $(pre)
                    .closest('.markdown-block-wrapper')
                    .removeClass('!tw-hidden');

                  $(pre)
                    .closest('.markdown-block-wrapper')
                    .nextUntil('.artifact-wrapper')
                    .next()
                    .addClass('!tw-hidden');
                }}
              >
                <FileCode className="tw-w-4 tw-h-4" />
              </div>
            </TooltipWrapper>
          </div>
          <div className="tw-absolute tw-bottom-2 tw-right-2 tw-flex tw-gap-2 tw-items-center">
            <TooltipWrapper content="Reset Zoom">
              <div
                className={
                  'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-foreground tw-transition-all active:tw-scale-95'
                }
                onClick={() => {
                  svgPanZoomRef.current?.resize();
                  svgPanZoomRef.current?.reset();
                }}
              >
                <RefreshCcw className="tw-w-4 tw-h-4" />
              </div>
            </TooltipWrapper>
          </div>
        </>
      )}
    </div>
  );
}
