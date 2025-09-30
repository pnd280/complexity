import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import styles from "@/plugins/thread-artifacts/components/renderer/sandpack.css?inline";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/store";

export default function HtmlRenderer() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code;
  const isInFlight = selectedCodeBlock?.states.isInFlight;

  if (!code) {
    return null;
  }

  return (
    <MemoizedPreviewContainer code={code} isInFlight={isInFlight ?? false} />
  );
}

const MemoizedPreviewContainer = memo(function MemoizedPreviewContainer({
  code,
  isInFlight,
}: {
  code: string;
  isInFlight: boolean;
}) {
  useInsertCss({
    id: "sandpack",
    css: styles,
  });

  const previewRef = useRef<SandpackPreviewRef>(null);

  useEffect(() => {
    if (previewRef.current) {
      artifactsStore.getState().setSandpackPreviewRef(previewRef.current);
    }
  }, []);

  return (
    <div id="sandpack-container" className="x:relative x:size-full">
      <SandpackProvider
        template="static"
        files={{
          "/index.html": isInFlight ? "" : code,
          "/assets/style.css": "something here",
        }}
      >
        <SandpackLayout>
          <SandpackPreview
            ref={previewRef}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
});
