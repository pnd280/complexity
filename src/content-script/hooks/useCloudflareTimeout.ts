import { QueryObserver } from "@tanstack/react-query";


import CplxUserSettings from "@/cplx-user-settings/CplxUserSettings";
import { toast } from "@/shared/toast";
import { queryClient } from "@/utils/ts-query-query-client";

export default function useCloudflareTimeout() {
  const [isTimedOut, setIsTimedOut] = useState(false);

  const autoRefreshSessionTimeout =
    CplxUserSettings.get().generalSettings.qolTweaks.autoRefreshSessionTimeout;

  const unsubscribe = useRef<() => void>();

  const observer = useMemo(
    () =>
      new QueryObserver(queryClient, {
        queryKey: ["userSettings"],
      }),
    [],
  );

  const cleanup = useCallback(() => {
    unsubscribe.current?.();
    observer.destroy();
  }, [observer]);

  const handleTimeout = useCallback(() => {
    cleanup();

    toast({
      title: "⚠️ Cloudflare timeout!",
      description: autoRefreshSessionTimeout
        ? "Refreshing the page..."
        : undefined,
      duration: 99999,
    });

    if (autoRefreshSessionTimeout)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
  }, [autoRefreshSessionTimeout, cleanup]);

  useEffect(() => {
    unsubscribe.current = observer.subscribe(({ failureReason }) => {
      if ($(document.body).hasClass("no-js")) return;

      if (failureReason && failureReason.message === "Cloudflare timeout") {
        setIsTimedOut(true);
      }
    });

    return cleanup;
  }, [autoRefreshSessionTimeout, cleanup, handleTimeout, observer]);

  return [isTimedOut, handleTimeout] as const;
}
