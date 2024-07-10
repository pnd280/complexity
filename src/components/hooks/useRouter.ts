import {
  useEffect,
  useState,
} from 'react';

import { webpageMessenger } from '@/content-script/main-world/messenger';

export default function useRouter() {
  const [url, setUrl] = useState(window.location.href);
  const [trigger, setTrigger] = useState<
    'push' | 'replace' | 'popstate' | 'routeChangeComplete'
  >();

  useEffect(() => {
    const stopListen = webpageMessenger.onMessage(
      'routeChange',
      async ({ payload: { url, trigger } }) => {
        if (trigger !== 'routeChangeComplete') return;

        setUrl(url);
        setTrigger(trigger);
      }
    );

    return () => stopListen?.();
  }, []);

  return { url, trigger };
}
