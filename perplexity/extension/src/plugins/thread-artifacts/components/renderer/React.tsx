import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";

import { Button } from "@/components/ui/button";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getActiveQueryBoxTextbox } from "@/plugins/__ui-groups__/elements/query-box/utils";
import styles from "@/plugins/thread-artifacts/components/renderer/sandpack.css?inline";
import {
  artifactsStore,
  useArtifactsStore,
} from "@/plugins/thread-artifacts/store";
import {
  formatArtifactTitle,
  getArtifactTitle,
  isAutonomousArtifactLanguageString,
} from "@/plugins/thread-artifacts/utils";

export default memo(function ReactRenderer() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code ?? "";
  const isInFlight = selectedCodeBlock?.states.isInFlight ?? false;

  return (
    <div id="sandpack-container" className="x:relative x:size-full">
      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            recharts: "2.15.0",
          },
        }}
        files={{
          "/App.js": isInFlight
            ? "export default function App() { return null; }"
            : code,
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
      >
        <PreviewContainer code={code} isInFlight={isInFlight} />
      </SandpackProvider>
    </div>
  );
});

function PreviewContainer({
  code,
  isInFlight,
}: {
  code: string;
  isInFlight: boolean;
}) {
  const { code: activeCode, updateCode } = useActiveCode();

  useEffect(() => {
    if (code !== activeCode && !isInFlight) {
      updateCode(code);
    }
  }, [activeCode, code, isInFlight, updateCode]);

  useInsertCss({
    id: "sandpack",
    css: styles,
  });

  return (
    <>
      <SandpackLayout>
        <SandpackPreview
          ref={(previewRef) => {
            artifactsStore.setState((draft) => {
              draft.preview.sandpackPreviewRef = previewRef;
            });
          }}
          showRefreshButton={false}
          showOpenInCodeSandbox={false}
        />
      </SandpackLayout>
      <FixErrorButtons />
    </>
  );
}

function FixErrorButtons() {
  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isAutonomousArtifact = isAutonomousArtifactLanguageString(
    selectedCodeBlock?.content.language,
  );

  const title = formatArtifactTitle(
    getArtifactTitle(selectedCodeBlock?.content.language),
  );

  const { sandpack } = useSandpack();

  if (!sandpack.error) return null;

  return (
    <div className="x:absolute x:bottom-4 x:left-4 x:z-10 x:flex x:flex-col x:gap-2 x:font-sans x:animate-in x:fade-in-0">
      <Button
        variant="caution"
        onClick={() => {
          if (!sandpack.error) return;
          const $queryBoxTextbox = getActiveQueryBoxTextbox();
          if (!$queryBoxTextbox.length) return;
          const errorText = `${isAutonomousArtifact && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${sandpack.error.message}`;
          $queryBoxTextbox.trigger("focus");
          document.execCommand("insertText", false, errorText);
        }}
      >
        Fix Error
      </Button>
    </div>
  );
}
