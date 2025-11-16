import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import { ExportFormatSelect } from "@/plugins/thread-export/ExportFormatSelect";
import { handleThreadCopy } from "@/plugins/thread-export/handlers/handleThreadCopy";
import { handleThreadDownload } from "@/plugins/thread-export/handlers/handleThreadDownload";
import { useCopyPplxThread } from "@/plugins/thread-export/hooks/useCopyPplxThread";

import TablerCheck from "~icons/tabler/check";
import TablerCopy from "~icons/tabler/copy";
import TablerFileDownload from "~icons/tabler/file-download";
import TablerFileExport from "~icons/tabler/file-export";
import TablerLoaderCircle from "~icons/tabler/loader-2";

export function ThreadExportMenu() {
  const { isMobile } = useIsMobileStore();
  const { copyThread, isFetching, getContent } = useCopyPplxThread();
  const [open, setOpen] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);

  const isThreadInFlight = useThreadDomObserverStore(
    (store) => store.states.isInFlight,
    deepEqual,
  );

  const defaultIdleText = isFetching ? (
    <TablerLoaderCircle className="x:size-4 x:animate-spin" />
  ) : (
    <TablerFileExport className="x:size-4" />
  );

  const [copyConfirmText, setCopyConfirmText, setCopyConfirmTextDefault] =
    useToggleButtonText({
      defaultText: null,
    });

  return (
    <Popover
      open={open}
      positioning={{ placement: isMobile ? "bottom" : "bottom-end" }}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Tooltip content={t("plugin-thread-export.action")}>
        <PopoverTrigger asChild>
          <Button
            disabled={isThreadInFlight || isFetching}
            variant="ghost"
            size="sm"
            className="x:box-content x:h-8 x:px-2.5 x:text-muted-foreground"
          >
            {isFetching
              ? defaultIdleText
              : (copyConfirmText ?? defaultIdleText)}
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent>
        <div className="x:flex x:flex-col x:gap-4">
          <ExportFormatSelect />
          <Checkbox
            label={t("plugin-thread-export.includeCitations")}
            defaultChecked={includeCitations}
            onCheckedChange={({ checked }) => {
              setIncludeCitations(checked as boolean);
            }}
          />
          <div className="x:flex x:gap-2">
            <Button
              className="x:flex x:items-center x:gap-2"
              onClick={async () => {
                setOpen(false);
                await handleThreadDownload({
                  getContent,
                  withCitations: includeCitations,
                });
              }}
            >
              <TablerFileDownload />
              <span>{t("plugin-thread-export.actions.download")}</span>
            </Button>
            <Button
              className="x:flex x:items-center x:gap-2"
              onClick={async () => {
                setOpen(false);
                setCopyConfirmTextDefault(
                  <TablerLoaderCircle className="x:size-4 x:animate-spin" />,
                );

                if (
                  await handleThreadCopy({
                    copyThread,
                    withCitations: includeCitations,
                  })
                ) {
                  setCopyConfirmText(<TablerCheck className="x:size-4" />);
                }
              }}
            >
              <TablerCopy />
              <span>{t("plugin-thread-export.actions.copy")}</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
