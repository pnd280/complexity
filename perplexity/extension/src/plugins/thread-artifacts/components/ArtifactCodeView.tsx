import type { CSSProperties, ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { useColorSchemeStore } from "@/plugins/__async-deps__/global-stores/color-scheme-store";
import useThreadCodeBlock from "@/plugins/__core__/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useArtifactsStore } from "@/plugins/thread-artifacts/store";
import { getInterpretedArtifactLanguage } from "@/plugins/thread-artifacts/utils";

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

  const lineNumberStyle: CSSProperties = {
    color: "oklch(var(--muted-foreground))",
  };

  return (
    <div
      id="artifact-code-view"
      className={cn(
        "x:h-full x:w-max x:min-w-full x:text-xs x:[&_span.linenumber]:text-muted-foreground! x:[&>pre]:m-0 x:[&>pre]:size-full x:[&>pre]:rounded-t-none",
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
        lineNumberStyle={lineNumberStyle}
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
