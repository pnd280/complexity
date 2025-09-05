import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ThreadMessageIndexContextProvider } from "@/plugins/_core/ui/groups/thread-message-index-context";
import { useCreatePortalContainers } from "@/plugins/_core/ui/groups/thread-query-edit-button-group/useCreatePortalContainers";
import { threadQueryHoverNormalizeCssResourceConfig } from "@/plugins/_core/ui/index.remote-resources";
import ThreadQueryMetricsWrapper from "@/plugins/thread-message-length/QueryWrapper";
import { getVersionedRemoteResource } from "@/services/externals/cplx-api/versioned-remote-resources/utils";

declare module "@/plugins/_core/ui/groups/types" {
  interface UiGroupRegistry {
    "thread:messageBlocks:queryEditButtonGroup": void;
  }
}

const normalizeCss = await getVersionedRemoteResource(
  threadQueryHoverNormalizeCssResourceConfig,
);

export function ThreadQueryEditButtonGroupExtraButtons() {
  const portalContainers = useCreatePortalContainers();

  useInsertCss({
    css: normalizeCss,
    id: "thread-query-edit-button-group-normalize",
  });

  return portalContainers.map((portalContainer, messageBlockIndex) => (
    <Portal key={messageBlockIndex} container={portalContainer as HTMLElement}>
      <ThreadMessageIndexContextProvider messageBlockIndex={messageBlockIndex}>
        <MemoizedWrapper />
      </ThreadMessageIndexContextProvider>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:h-full x:items-center">
      <ThreadQueryMetricsWrapper />
    </div>
  );
});
