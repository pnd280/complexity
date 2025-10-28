import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import Cplx from "@/components/icons/Cplx";
import { Portal } from "@/components/ui/portal";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { ContentScriptBgUtilsService } from "@/services/features/content-script-utils/service-init.bg-worker";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

import TablerX from "~icons/tabler/x";

export function PostUpdateBadge() {
  const settings = ExtensionSettingsService.cachedSync;

  const [open, setOpen] = useState(
    !settings.isPostUpdateReleaseNotesPopupDismissed,
  );

  const { isUpdateAvailable } = useExtensionUpdate();

  const { data } = useQuery({
    ...cplxApiQueries.changelog.detail({
      version: APP_CONFIG.VERSION,
    }),
    enabled:
      !settings.isPostUpdateReleaseNotesPopupDismissed && !isUpdateAvailable,
    retry: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: ms("30s"),
  });

  if (!open || isUpdateAvailable || data == null || data.length === 0)
    return null;

  const dismiss = () => {
    void ExtensionSettingsService.set((draft) => {
      draft.isPostUpdateReleaseNotesPopupDismissed = true;
    });
    setOpen(false);
  };

  return (
    <Portal>
      <div
        className="x:group x:fixed x:top-4 x:right-4"
        onClick={() => {
          void ContentScriptBgUtilsService.Instance.openFullScreenReleaseNotes({
            version: APP_CONFIG.VERSION,
          });
          dismiss();
        }}
      >
        <div className="x:flex x:w-fit x:cursor-pointer x:items-center x:gap-0 x:rounded-full x:border x:border-foreground-subtle x:bg-primary/10 x:p-1 x:px-3 x:text-primary x:shadow-lg x:transition-all x:group-hover:gap-2">
          <div className="x:flex x:items-center x:gap-1">
            <Cplx className="x:size-4.5 x:fill-foreground" />
            <span>Release Notes</span>
          </div>
          <div
            className="x:max-w-0 x:overflow-hidden x:rounded-full x:opacity-0 x:transition-all x:group-hover:max-w-6 x:group-hover:p-1 x:group-hover:opacity-100 x:hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              dismiss();
            }}
          >
            <TablerX className="x:size-4 x:text-muted-foreground" />
          </div>
        </div>
      </div>
    </Portal>
  );
}
