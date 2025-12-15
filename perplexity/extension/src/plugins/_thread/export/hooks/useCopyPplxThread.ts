import { useQuery } from "@tanstack/react-query";

import { toast } from "@/components/ui/use-toast";
import {
  threadMessageBlocksDomObserverStore,
  useThreadMessageBlocksDomObserverStore,
} from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/message-blocks/store";
import { DomSelectorsService } from "@/entrypoints/contexts/content-scripts/services/dom-selectors/service-init.loader";
import type { ThreadMessageApiResponse } from "@/entrypoints/services/externals/pplx-api/pplx-api.types";
import { PplxThreadParser } from "@/entrypoints/services/externals/pplx-api/pplx-thread-parser";
import { pplxApiQueries } from "@/entrypoints/services/externals/pplx-api/query-keys";
import { parseUrl } from "@/utils/misc/utils";
import { dualClipboardPut } from "@/utils/wrappers/clipboard-utils";

type FetchFn = () => Promise<ThreadMessageApiResponse[] | undefined>;

type CopyMessageParams = {
  messageBlockIndex: number;
  withCitations: boolean;
};

type CopyThreadParams = {
  withCitations: boolean;
};

type GetContentParams = {
  withCitations: boolean;
  messageBlockIndex?: number;
};

export function useCopyPplxThread() {
  const threadSlug = parseUrl().pathname.split("/").pop() || "";

  const { isFetching, refetch } = useQuery({
    ...pplxApiQueries.thread.detail(threadSlug),
    retry: false,
    enabled: false,
  });

  const fetchFn: FetchFn = async () => {
    const messageBlocksFiberData =
      useThreadMessageBlocksDomObserverStore.getState().messageBlocks;

    if (messageBlocksFiberData == null || messageBlocksFiberData.length > 50) {
      return (await refetch({ throwOnError: true })).data;
    }

    return messageBlocksFiberData.map((messageBlock) => ({
      query_str: messageBlock.content.title,
      text: {
        answer: messageBlock.content.answer,
        web_results: messageBlock.content.webResults,
      },
      backend_uuid: messageBlock.content.backendUuid,
      author_image: null,
      author_username: null,
      thread_url_slug: threadSlug,
      display_model: messageBlock.content.displayModel,
    }));
  };

  return {
    isFetching,
    copyMessage: async ({
      messageBlockIndex,
      withCitations,
    }: CopyMessageParams) => {
      return (
        withCitations
          ? copyMessageWithCitations({ messageBlockIndex })
          : copyMessageWithoutCitations({ messageBlockIndex })
      ).catch((error) => {
        toast({
          title: "❌ Failed to copy message",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      });
    },
    copyThread: async ({ withCitations }: CopyThreadParams) => {
      return (
        withCitations
          ? copyThreadWithCitations({ fetchFn })
          : copyThreadWithoutCitations({ fetchFn })
      ).catch((error) => {
        toast({
          title: "❌ Failed to copy thread",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      });
    },
    getContent: async ({
      withCitations,
      messageBlockIndex,
    }: GetContentParams) => {
      const threadJson = await fetchFn();

      invariant(threadJson != null, "Failed to fetch thread info");

      return PplxThreadParser.exportThread({
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
      DomSelectorsService.Root.cachedSync.THREAD.MESSAGE.FOOTER_CHILD
        .COPY_BUTTON,
    );

    if (!$copyButton.length) return;

    $copyButton.trigger("click");

    return;
  }

  const cleanAnswer = content.answer.replace(
    /\[(.*?)\]\(pplx:\/\/action\/followup\)/g,
    "$1",
  );

  if (content.webResults.length) {
    void dualClipboardPut({
      markdown: `${cleanAnswer}\n\nCitations:\n${PplxThreadParser.formatWebResults(content.webResults)}`,
    });
  } else {
    void dualClipboardPut({
      markdown: cleanAnswer,
    });
  }
}

async function copyMessageWithoutCitations({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const content =
    threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
      messageBlockIndex
    ]?.content;

  invariant(content != null, "Content not found");

  const message = PplxThreadParser.trimReferences({
    answer: content.answer,
    webResults: content.webResults,
  });

  void dualClipboardPut({ markdown: message });
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
  const threadJson = await fetchFn();

  invariant(threadJson != null, "Failed to fetch thread info");

  const message = PplxThreadParser.exportThread({
    threadJSON: threadJson,
    includeCitations: withCitations,
    messageIndex: messageBlockIndex,
  });

  await dualClipboardPut({ markdown: message });
}
