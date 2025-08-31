import { DialogContext } from "@ark-ui/react/dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import useCloudflareTimeout from "@/plugins/cloudflare-timeout-auto-reload/useCloudflareTimeout";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export function CloudflareTimeoutActionDialog() {
  const settings = ExtensionSettingsService.cachedSync;
  const { isSessionTimeout, handleReload } = useCloudflareTimeout();
  const [countdown, setCountdown] = useState(5);
  const countdownInterval = useRef<NodeJS.Timeout>(undefined);

  const isAutoReload =
    settings?.plugins.cloudflareTimeoutAutoReload.behavior === "reload";

  useEffect(() => {
    if (!isSessionTimeout || !isAutoReload) return;

    countdownInterval.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          handleReload();
          clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval.current);
  }, [handleReload, isSessionTimeout, isAutoReload]);

  if (!isSessionTimeout) return null;

  return (
    <Dialog defaultOpen={true} closeOnInteractOutside={false}>
      <DialogContext>
        {({ setOpen }) => (
          <DialogContent>
            <DialogHeader>
              {t(
                "plugin-cloudflare-timeout-auto-reload.actionDialog.sessionTimeoutTitle",
              )}
            </DialogHeader>
            <DialogDescription>
              {t(
                "plugin-cloudflare-timeout-auto-reload.actionDialog.sessionTimeoutDescription",
              )}
            </DialogDescription>
            <DialogFooter>
              <Button
                onClick={() => {
                  handleReload();
                  setOpen(false);
                }}
              >
                {t("plugin-cloudflare-timeout-auto-reload.actionDialog.reload")}
                {isAutoReload && <span> ({countdown})</span>}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  clearInterval(countdownInterval.current);
                  setOpen(false);
                }}
              >
                {t(
                  "plugin-cloudflare-timeout-auto-reload.actionDialog.dismiss",
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </DialogContext>
    </Dialog>
  );
}
