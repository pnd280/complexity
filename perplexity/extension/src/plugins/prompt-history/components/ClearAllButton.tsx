import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { promptHistoryQueries } from "@/plugins/prompt-history/indexed-db/query-keys";
import { PromptHistoryService } from "@/plugins/prompt-history/indexed-db/service-init.bg-worker";
import { queryClient } from "@/services/infra/query-client";

import TablerTrash from "~icons/tabler/trash";

export default function ClearAllButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearAll = () => {
    PromptHistoryService.Proxy.deleteAll();
    queryClient.invalidateQueries({
      queryKey: promptHistoryQueries.infinite.all(),
    });
    setIsOpen(false);
  };

  return (
    <Dialog
      lazyMount
      unmountOnExit
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <TablerTrash className="x:size-3.5 x:cursor-pointer x:text-xs x:text-muted-foreground x:transition-colors x:hover:text-foreground x:hover:underline" />
      </DialogTrigger>
      <DialogContent data-prompt-history-clear-all-dialog>
        <DialogHeader>
          <DialogTitle>
            {t("plugin-prompt-history.clearAllButton.dialog.title")}
          </DialogTitle>
        </DialogHeader>
        <div>{t("plugin-prompt-history.clearAllButton.dialog.message")}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("plugin-prompt-history.clearAllButton.dialog.actions.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleClearAll}>
            {t("plugin-prompt-history.clearAllButton.dialog.actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
