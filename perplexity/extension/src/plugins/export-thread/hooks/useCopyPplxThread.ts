import { useQuery } from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import type { ThreadMessageApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { dualClipboardPut } from "@/utils/clipboard-utils";
import { errorWrapper } from "@/utils/error-wrapper";
import { ThreadExport } from "@/utils/thread-export";
import { parseUrl } from "@/utils/utils";

type FetchFn = () => Promise<ThreadMessageApiResponse[] | undefined>;

type CopyMessageParams = {
  messageBlockIndex: number;
  withCitations: boolean;
  onComplete?: () => void;
};

type GetContentParams = {
  withCitations: boolean;
  messageBlockIndex?: number;
};

export function useCopyPplxThread() {
  const threadSlug = parseUrl().pathname.split("/").pop() || "";

  const { isFetching, refetch } = useQuery({
    ...pplxApiQueries.thread.detail(threadSlug),
    enabled: false,
  });

  const fetchFn = useCallback(async () => (await refetch()).data, [refetch]);

  return {
    isFetching,
    copyMessage: async function copyMessage({
      messageBlockIndex,
      withCitations,
      onComplete,
    }: CopyMessageParams) {
      try {
        if (withCitations) {
          await copyMessageWithCitations({ messageBlockIndex });
        } else {
          await copyMessageWithoutCitations({ messageBlockIndex, fetchFn });
        }
        onComplete?.();
      } catch (error) {
        toast({
          title: "❌ Failed to copy message",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    },
    copyThread: async function copyThread({
      withCitations,
      onComplete,
    }: {
      withCitations: CopyMessageParams["withCitations"];
      onComplete?: CopyMessageParams["onComplete"];
    }) {
      if (withCitations) {
        await copyThreadWithCitations({ fetchFn });
      } else {
        await copyThreadWithoutCitations({ fetchFn });
      }
      onComplete?.();
    },
    getContent: async function getContent({
      withCitations,
      messageBlockIndex,
    }: GetContentParams) {
      const threadJson = await fetchFn();
      if (threadJson == null) {
        throw new Error("Failed to fetch thread info");
      }

      return ThreadExport.exportThread({
        threadJSON: threadJson,
        includeCitations: withCitations,
        messageIndex: messageBlockIndex,
      });
    },
  };
}

async function copyMessageWithCitations({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const content =
    threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
      messageBlockIndex
    ]?.content;

  if (content == null) {
    const $footer =
      threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
        messageBlockIndex
      ]?.nodes.$footer;

    if (!$footer || !$footer.length) return;

    const $copyButton = $footer.find(
      DomSelectorsService.cachedSync.THREAD.MESSAGE.FOOTER_CHILD.COPY_BUTTON,
    );

    if (!$copyButton.length) return;

    $copyButton.trigger("click");

    return;
  }

  const cleanAnswer = content.answer.replace(
    /\[(.*?)\]\(pplx:\/\/action\/followup\)/g,
    "$1",
  );

  if (content.webResults != null && content.webResults.length) {
    dualClipboardPut({
      markdown: `${cleanAnswer}\n\nCitations:\n${ThreadExport.formatWebResults(content.webResults)}`,
    });
  } else {
    dualClipboardPut({
      markdown: cleanAnswer,
    });
  }
}

async function copyMessageWithoutCitations({
  messageBlockIndex,
  fetchFn,
}: {
  messageBlockIndex: number;
  fetchFn: FetchFn;
}) {
  copyContent({
    messageBlockIndex,
    fetchFn,
    withCitations: false,
  });
}

async function copyThreadWithCitations({ fetchFn }: { fetchFn: FetchFn }) {
  return copyContent({ fetchFn, withCitations: true });
}

async function copyThreadWithoutCitations({ fetchFn }: { fetchFn: FetchFn }) {
  return copyContent({ fetchFn, withCitations: false });
}

async function copyContent({
  withCitations,
  messageBlockIndex,
  fetchFn,
}: {
  withCitations: boolean;
  messageBlockIndex?: number;
  fetchFn: FetchFn;
}) {
  if (fetchFn == null) {
    throw new Error("Fetch function not provided");
  }

  const threadJson = await fetchFn();
  if (threadJson == null) {
    throw new Error("Failed to fetch thread info");
  }

  const message = ThreadExport.exportThread({
    threadJSON: threadJson,
    includeCitations: withCitations,
    messageIndex: messageBlockIndex,
  });

  const [, error] = await errorWrapper(() =>
    dualClipboardPut({ markdown: message }),
  )();

  if (error) {
    console.error(error);
    throw new Error("Please click/focus on the page while copying!");
  }
}
