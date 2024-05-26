import {
  useEffect,
  useState,
} from 'react';

import {
  onElementExist,
  OnElementExistOptions,
} from '@/utils/observer';

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
    const observer = onElementExist({
      selector,
      callback: ({ element }) => {
        callback?.({ element });
        setContainer(element);
      },
      observedIdentifier,
      recurring,
    });

    return () => {
      observer.disconnect();
    };
  });

  return container;
}
