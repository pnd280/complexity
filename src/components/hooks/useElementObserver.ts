import {
  useEffect,
  useState,
} from 'react';

import observer, { OnElementExistOptions } from '@/utils/observer';

type useElementObserverProps = Omit<OnElementExistOptions, 'callback'> & {
  callback?: ({ element }: { element: Element }) => void;
};

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
      callback: ({ element }) => {
        callback?.({ element });
        setContainer(element);
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
