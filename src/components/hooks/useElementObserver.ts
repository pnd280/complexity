import {
  useEffect,
  useState,
} from 'react';

import observer, { OnElementExistOptions } from '@/utils/observer';

export default function useElementObserver<T>({
  selector,
  recurring = true,
  observedIdentifier = 'observed',
  callback,
}: OnElementExistOptions<T>) {
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
