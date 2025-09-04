import type { ComponentProps, RefObject } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import lightStyle from "react-syntax-highlighter/dist/esm/styles/prism/vs";
import darkStyle from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

import { UiUtils } from "@/utils/ui-utils";

const INTERPRETED_LANGUAGES: Record<string, string> = {
  html: "markup",
  react: "jsx",
  markmap: "markdown",
  "c++": "cpp",
  js: "javascript",
  ts: "typescript",
  toml: "ini",
};

const CodeHighlighter = memo(function CodeHighlighter({
  children,
  language,
  codeRef,
  ...props
}: ComponentProps<typeof SyntaxHighlighter> & {
  codeRef?: RefObject<HTMLDivElement | null>;
}) {
  const colorScheme = useMemo(() => {
    return UiUtils.getCurrentColorScheme();
  }, []);

  const interpretedLanguage = language
    ? (INTERPRETED_LANGUAGES[language] ?? language)
    : "text";

  const targetLanguage = SyntaxHighlighter.supportedLanguages.includes(
    interpretedLanguage,
  )
    ? interpretedLanguage
    : "text";

  return (
    <SyntaxHighlighter
      style={colorScheme === "dark" ? darkStyle : lightStyle}
      codeTagProps={{
        className: "x:font-mono",
        style: {},
        ref: codeRef,
      }}
      language={targetLanguage}
      {...props}
    >
      {children}
    </SyntaxHighlighter>
  );
});

export default CodeHighlighter;
