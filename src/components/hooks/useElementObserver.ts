import {
  useEffect,
  useState,
} from 'react';

import observer, { OnElementExistOptions } from '@/utils/observer';

type useElementObserverProps = OnElementExistOptions<any>;

export default function useElementObserver({
  selector,
  recurring = true,
  observedIdentifier = 'observed',
  callback,
}: useElementObserverProps) {
  const [container, setContainer] = useState<Element>();

  useEffect(() => {
    const myObserver = observer.onElementExist({
      selector,
      callback: (args) => {
        callback?.(args);
        setContainer(args.element);
      },
      observedIdentifier,
      recurring,
    });

    return () => {
      myObserver.disconnect();
    };
  });

  return container;
}
