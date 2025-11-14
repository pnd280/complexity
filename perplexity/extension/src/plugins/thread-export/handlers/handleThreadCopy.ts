import type { ReactNode } from "react";

import { toast } from "@/components/ui/use-toast";

type HandleCopyParams = {
  copyThread: (params: { withCitations: boolean }) => Promise<void>;
  withCitations: boolean;
  showDelayedToast: (params: { title: string; description: string }) => void;
  dismissDelayedToast: () => void;
  setCopyConfirmText: (text: ReactNode) => void;
  setCopyConfirmTextDefault: (text: ReactNode) => void;
  t: typeof t;
  loaderIcon: ReactNode;
  checkIcon: ReactNode;
};

export async function handleThreadCopy({
  copyThread,
  withCitations,
  showDelayedToast,
  dismissDelayedToast,
  setCopyConfirmText,
  setCopyConfirmTextDefault,
  t,
  loaderIcon,
  checkIcon,
}: HandleCopyParams) {
  setCopyConfirmTextDefault(loaderIcon);

  showDelayedToast({
    title: t("plugin-thread-export.waiting.title"),
    description: t("plugin-thread-export.waiting.description"),
  });

  try {
    await copyThread({
      withCitations,
    });
    dismissDelayedToast();
    setCopyConfirmText(checkIcon);
  } catch (error) {
    dismissDelayedToast();
    console.error("Copy failed:", error);
    toast({
      title: t("plugin-thread-export.errors.copyFailed.title"),
      description:
        error instanceof Error
          ? error.message
          : t("plugin-thread-export.errors.copyFailed.unknownError"),
    });
  }
}
