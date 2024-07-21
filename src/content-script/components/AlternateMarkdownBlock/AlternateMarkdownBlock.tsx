import $ from 'jquery';

import { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';

import useMarkdownBlockObserver from '@/content-script/hooks/useMarkdownBlockObserver';
import { useDebounce } from '@uidotdev/usehooks';

import AlternateMarkdownBlockToolbar from './AlternateMarkdownBlockToolbar';
import Canvas, { CanvasLang } from '@/utils/Canvas';
import CanvasPlaceholder from '../Canvas/CanvasPlaceholder';

export type MarkdownBlockContainer = {
  wrapper: Element;
  header: Element;
  preElement: Element;
  lang: string;
  isNative: boolean;
  id: string;
};

export default function AlternateMarkdownBlock() {
  const [containers, setContainers] = useState<MarkdownBlockContainer[]>([]);
  const debouncedContainers = useDebounce(containers, 200);

  useMarkdownBlockObserver({
    setContainers,
  });

  return (
    <>
      {debouncedContainers
        .filter(
          (container) => $(`#${container.id}`).attr('data-mask') !== 'true'
        )
        .map((container, index) => (
          <Fragment key={index}>
            {ReactDOM.createPortal(
              <AlternateMarkdownBlockToolbar
                preBlockIndex={index}
                lang={container.lang}
                preBlockId={container.id}
              />,
              container.header
            )}
          </Fragment>
        ))}
      {debouncedContainers
        .filter(
          (container) =>
            $(`#${container.id}`).attr('data-mask') === 'true' &&
            Canvas.isCanvasLang(container.lang)
        )
        .map((container, index) => {
          return ReactDOM.createPortal(
            <CanvasPlaceholder
              preBlockId={container.id}
              preBlockIndex={index}
              lang={container.lang as CanvasLang}
            />,
            container.wrapper
          );
        })}
    </>
  );
}
