import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import type { ReactNode, RefObject } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import { getInterpretedArtifactLanguage } from "@/plugins/artifacts/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import type { BetterCodeBlockFineGrainedOptions } from "@/plugins/thread-better-code-blocks/types";
import { getBetterCodeBlockOptions } from "@/plugins/thread-better-code-blocks/utils";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";
import type { ExtensionSettings } from "@/services/infra/extension-api-wrappers/extension-settings/types";

const HighlightedCodeWrapper = memo(() => {
  const { codeBlock, maxHeight, isWrapped } = useMirroredCodeBlockContext();

  const isInFlight = codeBlock?.states.isInFlight;
  const code = codeBlock?.content.code ?? "";
  const language = codeBlock?.content.language;

  const interpretedLanguage = getInterpretedArtifactLanguage(
    language ?? "text",
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const fineGrainedSettings = getBetterCodeBlockOptions(language ?? "text");
  const globalSettings =
    ExtensionSettingsService.cachedSync.plugins["thread:betterCodeBlocks"];

  useOverflowing({
    wrapperRef,
    codeRef,
    fineGrainedSettings: fineGrainedSettings ?? globalSettings,
  });

  if (!codeBlock) return null;

  const showLineNumbers =
    fineGrainedSettings?.showLineNumbers ?? globalSettings?.showLineNumbers;

  return (
    <div
      ref={wrapperRef}
      style={{
        maxHeight,
      }}
      className="x:overflow-auto x:rounded-b-md"
    >
      <div
        className={cn(
          "x:[&>pre]:m-0 x:[&>pre]:rounded-t-none x:[&>pre]:!p-2 x:[&>pre]:!px-4",
          {
            "x:text-pretty x:[&_code]:!whitespace-pre-wrap": isWrapped,
            "x:[&_span]:duration-300 x:[&_span]:animate-in x:[&_span]:fade-in":
              isInFlight,
          },
          showLineNumbers && "x:[&_span.linenumber]:!text-muted-foreground",
        )}
      >
        <CodeHighlighter
          showLineNumbers={showLineNumbers}
          language={interpretedLanguage}
          codeRef={codeRef}
          PreTag={PreTag}
        >
          {code}
        </CodeHighlighter>
      </div>
    </div>
  );
});

function PreTag({ children }: { children: ReactNode }) {
  return <pre className="x:px-4 x:py-2">{children}</pre>;
}

export default HighlightedCodeWrapper;

function useOverflowing({
  wrapperRef,
  codeRef,
  fineGrainedSettings,
}: {
  wrapperRef: RefObject<HTMLDivElement | null>;
  codeRef: RefObject<HTMLDivElement | null>;
  fineGrainedSettings:
    | BetterCodeBlockFineGrainedOptions
    | ExtensionSettings["plugins"]["thread:betterCodeBlocks"];
}) {
  const windowSize = useDebounce(useWindowSize(), 300);

  const [initialWidth, setInitialWidth] = useState(0);

  const { setIsHorizontalOverflowing, setIsVerticalOverflowing } =
    useMirroredCodeBlockContext();

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    if (initialWidth === 0) {
      setInitialWidth(wrapperRef.current.scrollWidth);
    }
  }, [initialWidth, wrapperRef]);

  useEffect(() => {
    if (!wrapperRef.current || !codeRef.current) {
      return;
    }

    setIsHorizontalOverflowing(
      codeRef.current.getBoundingClientRect().width >
        wrapperRef.current.getBoundingClientRect().width,
    );
    setIsVerticalOverflowing(
      codeRef.current.getBoundingClientRect().height >
        fineGrainedSettings.maxHeight.value,
    );
  }, [
    codeRef,
    fineGrainedSettings.maxHeight.value,
    setIsHorizontalOverflowing,
    setIsVerticalOverflowing,
    windowSize,
    wrapperRef,
  ]);
}
