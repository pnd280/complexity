import $ from "jquery";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { MarkdownBlockContainer } from "@/content-script/components/AlternateMarkdownBlock/AlternateMarkdownBlock";
import useWaitForMessagesContainer from "@/content-script/hooks/useWaitForMessagesContainer";
import { preBlockAttrsContentScript } from "@/content-script/main-world/pre-block-attrs";
import { shikiContentScript } from "@/content-script/main-world/shiki";
import DomObserver from "@/utils/DomObserver/DomObserver";
import MarkdownBlockUtils from "@/utils/MarkdownBlock";
import { isDomNode } from "@/utils/utils";

type useMarkdownBlockObserverProps = {
  setContainers: Dispatch<SetStateAction<MarkdownBlockContainer[]>>;
};

const compare = (
  prev: MarkdownBlockContainer[],
  next: MarkdownBlockContainer[],
): boolean => {
  if (prev.length !== next.length) return false;
  for (let i = prev.length - 1; i >= 0; i--) {
    if (prev[i].preElement !== next[i].preElement) {
      return false;
    }
  }
  return true;
};

export default function useMarkdownBlockObserver({
  setContainers,
}: useMarkdownBlockObserverProps) {
  const containersRef = useRef<MarkdownBlockContainer[]>([]);

  const updateContainers = useCallback(
    (newContainers: MarkdownBlockContainer[]) => {
      if (!compare(containersRef.current, newContainers)) {
        containersRef.current = newContainers;
        setContainers(newContainers);
      }
    },
    [setContainers],
  );

  const { messagesContainer } = useWaitForMessagesContainer();

  useEffect(
    function toolbarObserver() {
      if (!isDomNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = "markdown-block-toolbar";

      (async () => {
        await preBlockAttrsContentScript.waitForInitialization();

        requestAnimationFrame(callback);

        DomObserver.create(id, {
          target: messagesContainer,
          config: { childList: true, subtree: true },
          throttleTime: 200,
          source: "hook",
          onAny: callback,
        });
      })();

      function callback() {
        const promises: Promise<MarkdownBlockContainer | null>[] = [];

        $(".message-block pre").each((index, pre) => {
          promises.push(
            new Promise<MarkdownBlockContainer | null>((resolve) => {
              queueMicrotask(() => {
                const { $wrapper, $container, lang } =
                  MarkdownBlockUtils.transformPreBlock(pre) || {};

                if (
                  $container?.length == null ||
                  $wrapper?.length == null ||
                  !lang
                )
                  return resolve(null);

                resolve({
                  wrapper: $wrapper[0],
                  header: $container[0],
                  preElement: pre,
                  lang,
                  isNative: true,
                });
              });
            }),
          );
        });

        Promise.all(promises).then((results) => {
          const newContainers = results.filter(
            (result): result is MarkdownBlockContainer => result !== null,
          );

          updateContainers(newContainers);
        });
      }
      return () => {
        DomObserver.destroy(id);
      };
    },
    [updateContainers, messagesContainer],
  );

  useEffect(
    function alternateMarkdownBlockObservers() {
      if (!isDomNode(messagesContainer) || !$(messagesContainer).length) return;

      const id = "alternate-markdown-block";

      (async () => {
        await preBlockAttrsContentScript.waitForInitialization();

        await shikiContentScript.waitForInitialization();

        requestIdleCallback(callback);

        DomObserver.create(id, {
          target: messagesContainer,
          config: {
            childList: true,
            subtree: true,
          },
          throttleTime: 200,
          source: "hook",
          onAny: callback,
        });
      })();

      function callback() {
        $(".message-block pre").each((_, pre) => {
          queueMicrotask(async () => {
            MarkdownBlockUtils.handleVisibility(pre);

            if (!$(pre).attr("id")) return;

            const isInFlight =
              await MarkdownBlockUtils.handleInFlightState(pre);

            if (!isInFlight)
              MarkdownBlockUtils.highlightNativelyUnsupportedLang(pre);
          });
        });
      }

      return () => {
        DomObserver.destroy(id);
      };
    },
    [messagesContainer],
  );
}
