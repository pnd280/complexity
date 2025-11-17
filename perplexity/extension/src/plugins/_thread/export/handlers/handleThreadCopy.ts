import { toast } from "@/components/ui/use-toast";

type HandleCopyParams = {
  copyThread: (params: { withCitations: boolean }) => Promise<void>;
  withCitations: boolean;
};

export async function handleThreadCopy({
  copyThread,
  withCitations,
}: HandleCopyParams): Promise<boolean> {
  let toastTimeout: number | null = null;
  let toastRef: ReturnType<typeof toast> | null = null;

  const showWaitingToast = () => {
    toastTimeout = window.setTimeout(() => {
      toastRef = toast({
        title: t("plugin-thread-export.waiting.title"),
        description: t("plugin-thread-export.waiting.description"),
        duration: Infinity,
      });
    }, 1500);
  };

  const dismissWaitingToast = () => {
    if (toastTimeout != null) {
      clearTimeout(toastTimeout);
    }
    toastRef?.dismiss();
  };

  showWaitingToast();

  try {
    await copyThread({
      withCitations,
    });
    dismissWaitingToast();
    return true;
  } catch (error) {
    dismissWaitingToast();
    console.error("Copy failed:", error);
    toast({
      title: t("plugin-thread-export.errors.copyFailed.title"),
      description:
        error instanceof Error
          ? error.message
          : t("plugin-thread-export.errors.copyFailed.unknownError"),
    });
    return false;
  }
}
