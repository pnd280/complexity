import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useIsMobileStore } from "@/hooks/is-mobile-store";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useThreadDomObserverStore } from "@/plugins/__core__/dom-observers/thread/store";
import type { ExportOption } from "@/plugins/thread-export/export-options";
import { ExportFormatSelect } from "@/plugins/thread-export/ExportFormatSelect";
import { useCopyPplxThread } from "@/plugins/thread-export/hooks/useCopyPplxThread";
import downloadFile from "@/utils/misc/download-file";

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
  const [_format, setFormat] = useState<ExportOption["value"]>("markdown");

  const isThreadInFlight = useThreadDomObserverStore(
    (state) => state.states.isInFlight,
    deepEqual,
  );

  const defaultIdleText = isFetching ? (
    <TablerLoaderCircle className="x:size-4 x:animate-spin" />
  ) : (
    <TablerFileExport className="x:size-4" />
  );

  const [copyConfirmText, setCopyConfirmText] = useToggleButtonText({
    defaultText: null,
  });

  const handleDownload = async (withCitations: boolean) => {
    const filename = `${document.title.substring(0, 100)} ${withCitations ? "" : " (no-citations)"}.md`;

    try {
      const start = performance.now();
      const content = await getContent({ withCitations });
      const elapsed = performance.now() - start;

      // if the time between calling .showSaveFilePicker and the last user gesture is too long, the browser will raise a security error.
      if (elapsed > 500) {
        toast({
          title: (
            <div className="x:flex x:items-center x:gap-1">
              <TablerFileDownload className="x:size-4 x:text-primary" />
              <span>
                {t(
                  "plugin-thread-export.actions.largeFileDownloadPrompt.title",
                )}
              </span>
            </div>
          ),
          description: t(
            "plugin-thread-export.actions.largeFileDownloadPrompt.description",
          ),
          className: "x:cursor-pointer",
          onClick: () => {
            void downloadFile({
              data: content,
              filename,
            });
          },
        });
        return;
      }

      await downloadFile({
        data: content,
        filename,
      });
    } catch (error) {
      console.error("Failed to download:", error);
      toast({
        title: t("plugin-thread-export.errors.downloadFailed.title"),
        description:
          error instanceof Error
            ? error.message
            : t("plugin-thread-export.errors.downloadFailed.unknownError"),
      });
    }
  };

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
            className="x:box-content x:h-8 x:px-2.5"
          >
            {isFetching
              ? defaultIdleText
              : (copyConfirmText ?? defaultIdleText)}
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent>
        <div className="x:text-sm x:font-medium">Export all messages</div>

        <div className="x:flex x:flex-col x:gap-4">
          <ExportFormatSelect onValueChange={setFormat} />
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
              onClick={() => {
                void handleDownload(includeCitations);
                setOpen(false);
              }}
            >
              <TablerFileDownload />
              <span>{t("plugin-thread-export.actions.download")}</span>
            </Button>
            <Button
              className="x:flex x:items-center x:gap-2"
              onClick={() => {
                void copyThread({
                  withCitations: includeCitations,
                  onComplete: () => {
                    setCopyConfirmText(<TablerCheck className="x:size-4" />);
                  },
                });
                setOpen(false);
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
