import { useEffect, useState } from "react";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { RouterEvent } from "@/types/ws.types";

export default function useRouter() {
  const [state, setState] = useState({
    url: window.location.href,
    trigger: undefined as RouterEvent | undefined,
  });

  useEffect(() => {
    const stopListen = webpageMessenger.onMessage(
      "routeChange",
      async ({ payload: { url, trigger } }) => {
        setState({ url, trigger });
      },
    );

    return () => stopListen?.();
  }, []);

  return state;
}
