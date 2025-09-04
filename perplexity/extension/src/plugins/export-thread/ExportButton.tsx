import { LuCheck, LuLoaderCircle } from "react-icons/lu";

import FaFileExport from "@/components/icons/FaFileExport";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import useToggleButtonText from "@/hooks/useToggleButtonText";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import type { ExportOption } from "@/plugins/export-thread/export-options";
import { ExportActions } from "@/plugins/export-thread/ExportActions";
import { ExportFormatSelect } from "@/plugins/export-thread/ExportFormatSelect";
import { useCopyPplxThread } from "@/plugins/export-thread/hooks/useCopyPplxThread";
import { parseUrl } from "@/utils/utils";

const ExportButton = memo(function ExportButton() {
  const isThreadInFlight = useThreadDomObserverStore(
    (state) => state.states.isInFlight,
    deepEqual,
  );

  const { isMobile } = useIsMobileStore();
  const { copyThread, isFetching, getContent } = useCopyPplxThread();
  const [open, setOpen] = useState(false);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [_format, setFormat] = useState<ExportOption["value"]>("markdown");

  const defaultIdleText = useMemo(
    () =>
      isFetching ? (
        <LuLoaderCircle className="x:size-4 x:animate-spin" />
      ) : (
        <FaFileExport className="x:size-4" />
      ),
    [isFetching],
  );

  const [copyConfirmText, setCopyConfirmText] = useToggleButtonText({
    defaultText: null,
  });

  const handleDownload = useCallback(
    async (withCitations: boolean) => {
      try {
        const slug =
          (parseUrl().pathname.split("/").pop() ||
            `thread-${new Date().getTime()}`) +
          (withCitations ? "" : " (no-citations)");
        const content = await getContent({ withCitations });
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download:", error);
        toast({
          title: t("plugin-export-thread.errors.downloadFailed.title"),
          description:
            error instanceof Error
              ? error.message
              : t("plugin-export-thread.errors.downloadFailed.unknownError"),
        });
      }
    },
    [getContent],
  );

  return (
    <Popover
      open={open}
      positioning={{ placement: isMobile ? "bottom" : "bottom-end" }}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <Tooltip content={t("plugin-export-thread.action")}>
        <PopoverTrigger asChild>
          <Button
            disabled={isThreadInFlight}
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
            label={t("plugin-export-thread.includeCitations")}
            defaultChecked={includeCitations}
            onCheckedChange={({ checked }) => {
              setIncludeCitations(checked as boolean);
            }}
          />
          <ExportActions
            onDownload={() => {
              setOpen(false);
              handleDownload(includeCitations);
            }}
            onCopy={() => {
              setOpen(false);
              copyThread({
                withCitations: includeCitations,
                onComplete: () => {
                  setCopyConfirmText(<LuCheck className="x:size-4" />);
                },
              });
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
});

export default ExportButton;
