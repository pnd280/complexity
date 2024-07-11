import {
  Fragment,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import { useDebounce } from '@uidotdev/usehooks';

import useMarkdownBlockObserver from '../hooks/useMarkdownBlockObserver';
import MarkdownBlockToolbar from './MarkdownBlockToolbar';

export type MarkdownBlockContainer = {
  header: Element;
  preElement: Element;
  lang: string;
  isNative: boolean;
  id: string;
};

export type MarkdownBlockStates = {
  isCopied: boolean;
};

export default function MarkdownBlockHeader() {
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
              <MarkdownBlockToolbar
                lang={container.lang}
                preElementId={container.id}
              />
            </>,
            container.header
          )}
        </Fragment>
      ))}
    </>
  );
}
