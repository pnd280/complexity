import { useLocalStorage } from "@uidotdev/usehooks";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInsertCss } from "@/hooks/useInsertCss";
import { persistentQueryClient } from "@/plugins/__async-deps__/persistent-query-cache/index.lib-loader";
import { getActiveQueryBox } from "@/plugins/__ui-groups__/elements/query-box/utils";
import { normalizeCssResourceConfig } from "@/plugins/force-writing-mode/index.remote-resources";
import { useForceWritingModeStore } from "@/plugins/force-writing-mode/store";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

import TablerPencil from "~icons/tabler/pencil";

const normalizeCss = await getVersionedRemoteResource(
  normalizeCssResourceConfig,
  persistentQueryClient,
);

export function ForceWritingModeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [warningShown, setWarningShown] = useLocalStorage(
    "cplx.spacesThreadsForceWritingMode.warningShown",
    true,
  );

  useInsertCss({
    css: normalizeCss,
    id: "spaces-threads-force-writing-mode-normalize",
  });

  const { forceWritingMode, setForceWritingMode } = useForceWritingModeStore(
    (store) => ({
      forceWritingMode: store.spacesThreadsForceWritingMode,
      setForceWritingMode: store.setSpacesThreadsForceWritingMode,
    }),
    deepEqual,
  );

  useEffect(() => {
    const $queryBox = getActiveQueryBox();

    if (!$queryBox[0]) return;

    $queryBox.attr(
      "data-cplx-force-writing-mode",
      forceWritingMode ? "true" : "false",
    );
  }, [forceWritingMode]);

  return (
    <Dialog
      open={warningShown ? isOpen : false}
      onOpenChange={({ open }) => {
        if (!forceWritingMode) return;

        setIsOpen(open);
      }}
    >
      <Tooltip content={"Writing mode"}>
        <DialogTrigger asChild>
          <button
            className={cn(
              "x:-order-2 x:flex x:size-8 x:cursor-pointer x:items-center x:justify-center x:gap-1 x:rounded-lg x:text-center x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:hover:bg-foreground-subtle x:focus-visible:bg-foreground-subtle x:focus-visible:outline-none x:active:scale-95 x:disabled:cursor-not-allowed x:disabled:opacity-50",
              {
                "x:text-primary": forceWritingMode,
                "x:hover:text-foreground": !forceWritingMode,
              },
            )}
            onClick={() => setForceWritingMode(!forceWritingMode)}
          >
            <TablerPencil className="x:size-3.5" />
          </button>
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Force Writing Mode</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          When enabled, this mode will NOT consider any sources in your answer,
          including uploaded attachments in this Space.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setWarningShown(false)}>
              I understand, don't show again
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>I understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
