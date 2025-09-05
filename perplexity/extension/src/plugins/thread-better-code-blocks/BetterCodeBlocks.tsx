import type { ReactNode } from "react";

import { Portal } from "@/components/ui/portal";
import { queryClient } from "@/data/query-client";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import {
  hideNativeCodeBlocksCssResourceConfig,
  stickyHeaderCssResourceConfig,
} from "@/plugins/thread-better-code-blocks/index.remote-resources";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/thread-better-code-blocks/indexed-db/query-keys";
import MirroredCodeBlock from "@/plugins/thread-better-code-blocks/MirroredCodeBlock";
import { MirroredCodeBlockContextProvider } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import {
  createMirroredPortalContainer,
  getBetterCodeBlockOptions,
} from "@/plugins/thread-better-code-blocks/utils";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

const [hideNativeCodeBlocksCss, stickyHeaderCss] = await Promise.all([
  getVersionedRemoteResource(hideNativeCodeBlocksCssResourceConfig),
  getVersionedRemoteResource(stickyHeaderCssResourceConfig),
]);

await queryClient.prefetchQuery({
  ...betterCodeBlocksFineGrainedOptionsQueries.list.detail(),
  gcTime: Infinity,
});

export function BetterCodeBlocks() {
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useInsertCss({
    id: "cplx-hide-native-code-blocks",
    css: hideNativeCodeBlocksCss,
  });

  useInsertCss({
    id: "cplx-sticky-header",
    css: stickyHeaderCss,
  });

  if (!codeBlocksChunks) return null;

  return codeBlocksChunks.map((chunk, sourceMessageBlockIndex) =>
    chunk.map((_, sourceCodeBlockIndex) => (
      <ContextWrapper
        key={`${sourceMessageBlockIndex}-${sourceCodeBlockIndex}`}
        sourceMessageBlockIndex={sourceMessageBlockIndex}
        sourceCodeBlockIndex={sourceCodeBlockIndex}
      >
        <MirroredCodeBlock />
      </ContextWrapper>
    )),
  );
}

function ContextWrapper({
  children,
  sourceMessageBlockIndex,
  sourceCodeBlockIndex,
}: {
  children: ReactNode;
  sourceMessageBlockIndex: number;
  sourceCodeBlockIndex: number;
}) {
  const codeBlock = useThreadCodeBlock({
    messageBlockIndex: sourceMessageBlockIndex,
    codeBlockIndex: sourceCodeBlockIndex,
  });

  if (!codeBlock) return null;

  const settings =
    getBetterCodeBlockOptions(codeBlock.content.language) ??
    ExtensionSettingsService.cachedSync.plugins["thread:betterCodeBlocks"];

  const portalContainer = createMirroredPortalContainer(
    codeBlock,
    sourceCodeBlockIndex,
  );

  return (
    <Portal container={portalContainer}>
      <MirroredCodeBlockContextProvider
        storeValue={{
          sourceMessageBlockIndex,
          sourceCodeBlockIndex,
          isWrapped: !settings.unwrap.enabled,
          maxHeight:
            settings.maxHeight.enabled && settings.maxHeight.collapseByDefault
              ? settings.maxHeight.value
              : 9999,
          maxWidth: settings.maxWidth.enabled ? settings.maxWidth.value : 100,
          isHorizontalOverflowing: false,
          isVerticalOverflowing: false,
        }}
      >
        {children}
      </MirroredCodeBlockContextProvider>
    </Portal>
  );
}
