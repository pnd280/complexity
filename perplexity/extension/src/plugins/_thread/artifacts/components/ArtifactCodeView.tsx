import type { ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import useThreadCodeBlock from "@/entrypoints/contexts/content-scripts/core-plugins/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useColorSchemeStore } from "@/entrypoints/contexts/content-scripts/stores/color-scheme-store";
import { useArtifactsStore } from "@/plugins/_thread/artifacts/store";
import { getInterpretedArtifactLanguage } from "@/plugins/_thread/artifacts/utils";

export default function ArtifactCodeView() {
  const colorScheme = useColorSchemeStore(
    (store) => store.colorScheme,
    deepEqual,
  );

  const selectedCodeBlockLocation = useArtifactsStore(
    (store) => store.selection.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const codeString = selectedCodeBlock?.content.code ?? "";
  const language = getInterpretedArtifactLanguage(
    selectedCodeBlock?.content.language ?? "",
  );

  return (
    <div
      id="artifact-code-view"
      className={cn(
        "x:h-full x:w-max x:min-w-full x:text-xs x:[&>pre]:m-0 x:[&>pre]:size-full x:[&>pre]:rounded-t-none",
        {
          "x:[&_span]:duration-300 x:[&_span]:animate-in x:[&_span]:fade-in":
            isInFlight,
        },
      )}
    >
      <CodeHighlighter
        showLineNumbers
        colorScheme={colorScheme === "light" ? "light" : "dark"}
        language={language}
        PreTag={PreTag}
      >
        {codeString}
      </CodeHighlighter>
    </div>
  );
}

function PreTag({ children }: { children: ReactNode }) {
  return <pre className="x:px-4 x:py-2">{children}</pre>;
}
