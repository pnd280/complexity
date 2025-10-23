import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import ChangelogRenderer from "@/components/changelog/ChangelogRenderer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cplxApiQueries } from "@/services/externals/cplx-api/query-keys";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export function PostUpdateReleaseNotesDialog() {
  const [open, setOpen] = useState(true);

  const {
    data: changelog,
    isLoading,
    isError,
  } = useQuery(
    cplxApiQueries.changelog.detail({
      version: APP_CONFIG.VERSION,
    }),
  );

  useEffect(() => {
    void ExtensionSettingsService.set((draft) => {
      draft.isPostUpdateReleaseNotesPopupDismissed = true;
    });
  }, []);

  if (isLoading || isError || !changelog) return null;

  return (
    <Dialog open={open} onOpenChange={({ open }) => setOpen(open)}>
      <DialogContent className="x:w-max x:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {t("common.releaseNotes.title", { version: APP_CONFIG.VERSION })}
          </DialogTitle>
        </DialogHeader>
        <ChangelogRenderer
          changelog={changelog}
          className="x:md:max-w-[900px]"
        />
        <DialogFooter>
          <DontShowAgainForFutureUpdatesConfirmDialog
            onConfirm={() => {
              void ExtensionSettingsService.set((draft) => {
                draft.showPostUpdateReleaseNotesPopup = false;
                draft.isPostUpdateReleaseNotesPopupDismissed = true;
              });
              setOpen(false);
            }}
          >
            <Button>{t("common.releaseNotes.dontShowAgain")}</Button>
          </DontShowAgainForFutureUpdatesConfirmDialog>
          <DialogClose asChild>
            <Button>{t("common.releaseNotes.dismiss")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DontShowAgainForFutureUpdatesConfirmDialog({
  children,
  onConfirm,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent portal={false}>
        <DialogHeader>
          <DialogTitle>
            {t("common.releaseNotes.confirmDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="x:text-sm x:text-muted-foreground">
          {t("common.releaseNotes.confirmDialog.message")}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {t("common.releaseNotes.confirmDialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm}>
              {t("common.releaseNotes.confirmDialog.confirm")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
