import {
  useEffect,
  useRef,
} from 'react';

import $ from 'jquery';
import {
  FileCode,
  RefreshCcw,
} from 'lucide-react';
import svgPanZoom from 'svg-pan-zoom';

import TooltipWrapper from '@/components/TooltipWrapper';
import { useGlobalStore } from '@/content-script/session-store/global';
import { webpageMessenger } from '@/content-script/webpage/messenger';
import observer from '@/utils/observer';
import { sleep } from '@/utils/utils';

export default function MermaidDiagram({
  pre,
  code,
}: {
  pre: Element;
  code: string;
}) {
  const svgPanZoomRef = useRef<SvgPanZoom.Instance>();

  const enable = useGlobalStore((state) => state.artifacts.mermaid);

  useEffect(() => {
    if (!enable) return;

    const runMermaid = async () => {
      let success = false;

      while (!success) {
        success = await webpageMessenger.sendMessage({
          event: 'runMermaid',
          payload: '.mermaid-run',
          timeout: 1000,
        });

        await sleep(100);
      }
    };

    requestIdleCallback(async () => {
      $(pre).closest('.code-block-wapper').addClass('!tw-hidden');

      await runMermaid();

      $(pre)
        .closest('.code-block-wapper')
        .parent()
        .find('.mermaid-run')
        .removeClass('tw-opacity-0 tw-invisible')
        .addClass('tw-animate-in tw-fade-in');

      observer.onElementExist({
        container: $(pre).closest('.code-block-wapper').parent()[0],
        selector: () => [
          $(pre)
            .closest('.code-block-wapper')
            .parent()
            .find('.mermaid-wrapper svg')[0],
        ],
        callback: ({ element }) => {
          requestIdleCallback(() => {
            svgPanZoomRef.current = svgPanZoom(element as HTMLElement, {
              zoomScaleSensitivity: 1,
              center: true,
              fit: true,
              contain: true,
            });
          });
        },
        recurring: false,
      });
    });
  }, [pre, enable]);

  return (
    <div className="tw-relative">
      <div className="mermaid-run tw-h-[500px] tw-my-4 tw-block tw-border tw-border-border tw-rounded-md tw-select-none [&>svg]:!tw-flex-grow [&>svg]:!tw-max-w-none [&>svg]:!tw-h-full tw-opacity-0 tw-invisible">
        {code}
      </div>

      <div className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-gap-2 tw-items-center">
        <TooltipWrapper content="View code">
          <div
            className={
              'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95'
            }
            onClick={() => {
              $(pre).closest('.code-block-wapper').removeClass('!tw-hidden');

              $(pre)
                .closest('.code-block-wapper')
                .parent()
                .find('.mermaid-run')
                .removeClass('tw-animate-in tw-fade-in');

              $(pre)
                .closest('.code-block-wapper')
                .parent()
                .find('.mermaid-wrapper')
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
              'tw-cursor-pointer tw-text-muted-foreground hover:tw-text-background dark:hover:tw-text-foreground tw-transition-all active:tw-scale-95'
            }
            onClick={() => {
              svgPanZoomRef.current?.reset();
            }}
          >
            <RefreshCcw className="tw-w-4 tw-h-4" />
          </div>
        </TooltipWrapper>
      </div>
    </div>
  );
}
