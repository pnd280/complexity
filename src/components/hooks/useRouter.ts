import {
  useEffect,
  useState,
} from 'react';

import { webpageMessenger } from '@/content-script/main-world/messenger';

export default function useRouter() {
  const [url, setUrl] = useState(window.location.href);

  useEffect(() => {
    const stopListen = webpageMessenger.onMessage(
      'routeChange',
      async ({ payload: url }) => {
        setUrl(url);
      }
    );

    return () => stopListen?.();
  }, [setUrl]);

  return url;
}
