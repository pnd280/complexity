import { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';

import useMarkdownBlockObserver from '@/content-script/hooks/useMarkdownBlockObserver';
import { useDebounce } from '@uidotdev/usehooks';

import AlternateMarkdownBlockToolbar from './AlternateMarkdownBlockToolbar';

export type MarkdownBlockContainer = {
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
      {debouncedContainers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(
            <>
              <AlternateMarkdownBlockToolbar
                preBlockIndex={index}
                lang={container.lang}
                preBlockId={container.id}
              />
            </>,
            container.header
          )}
        </Fragment>
      ))}
    </>
  );
}
