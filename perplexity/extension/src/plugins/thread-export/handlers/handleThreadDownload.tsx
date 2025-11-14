import { toast } from "@/components/ui/use-toast";
import downloadFile from "@/utils/misc/download-file";

import TablerFileDownload from "~icons/tabler/file-download";

type HandleDownloadParams = {
  getContent: (params: { withCitations: boolean }) => Promise<string>;
  withCitations: boolean;
  showDelayedToast: (params: { title: string; description: string }) => void;
  dismissDelayedToast: () => void;
  t: typeof t;
};

export async function handleThreadDownload({
  getContent,
  withCitations,
  showDelayedToast,
  dismissDelayedToast,
  t,
}: HandleDownloadParams) {
  const filename = `${document.title.substring(0, 100)} ${withCitations ? "" : " (no-citations)"}.md`;

  showDelayedToast({
    title: t("plugin-thread-export.waiting.title"),
    description: t("plugin-thread-export.waiting.description"),
  });

  try {
    const start = performance.now();
    const content = await getContent({ withCitations });
    const elapsed = performance.now() - start;

    dismissDelayedToast();

    // if the time between calling .showSaveFilePicker and the last user gesture is too long, the browser will raise a security error.
    if (elapsed > 500) {
      const toastInstance = toast({
        title: (
          <div className="x:flex x:items-center x:gap-1">
            <TablerFileDownload className="x:size-4 x:text-primary" />
            <span>
              {t("plugin-thread-export.actions.largeFileDownloadPrompt.title")}
            </span>
          </div>
        ),
        description: t(
          "plugin-thread-export.actions.largeFileDownloadPrompt.description",
        ),
        className: "x:cursor-pointer",
        onClick: () => {
          toastInstance.dismiss();
          void downloadFile({
            data: content,
            filename,
          });
        },
        duration: Infinity,
      });
      return;
    }

    await downloadFile({
      data: content,
      filename,
    });
  } catch (error) {
    dismissDelayedToast();
    console.error("Failed to download:", error);
    toast({
      title: t("plugin-thread-export.errors.downloadFailed.title"),
      description:
        error instanceof Error
          ? error.message
          : t("plugin-thread-export.errors.downloadFailed.unknownError"),
    });
  }
}
