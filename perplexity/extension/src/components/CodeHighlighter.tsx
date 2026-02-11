import type { CSSProperties, ElementType, ReactNode, RefObject } from "react";
import type { BundledLanguage } from "shiki";

import { useShikiHighlighter } from "@/hooks/useShikiHighlighter";

const INTERPRETED_LANGUAGES: Record<string, string> = {
  html: "html",
  react: "jsx",
  markmap: "markdown",
  "c++": "cpp",
  js: "javascript",
  ts: "typescript",
  toml: "toml",
};

const SHIKI_THEMES = {
  dark: "dark-plus",
  light: "light-plus",
} as const;

type CodeHighlighterProps = {
  children: string;
  language?: string;
  colorScheme: "dark" | "light";
  codeRef?: RefObject<HTMLDivElement | null>;
  showLineNumbers?: boolean;
  lineNumberStyle?: CSSProperties;
  PreTag?: ElementType<{ children: ReactNode }>;
};

export default function CodeHighlighter({
  children,
  language,
  colorScheme,
  codeRef,
  showLineNumbers,
  lineNumberStyle,
  PreTag = "pre",
}: CodeHighlighterProps) {
  const interpretedLanguage = language
    ? (INTERPRETED_LANGUAGES[language] ?? language)
    : "text";

  const { highlighter, isReady, resolvedLanguage } =
    useShikiHighlighter(interpretedLanguage);

  if (!isReady || !highlighter) {
    return (
      <PreTag>
        <code ref={codeRef} className="x:font-mono">
          {children}
        </code>
      </PreTag>
    );
  }

  const tokens = highlighter.codeToTokens(children, {
    lang: resolvedLanguage as BundledLanguage,
    theme: SHIKI_THEMES[colorScheme],
  });

  const fgColor = tokens.fg;

  return (
    <PreTag>
      <code ref={codeRef} className="x:font-mono" style={{ color: fgColor }}>
        {tokens.tokens.map((line, lineIndex) => (
          <span key={lineIndex} className="line">
            {showLineNumbers && (
              <span
                className="linenumber x:inline-block x:w-8 x:pr-4 x:text-right x:select-none"
                style={lineNumberStyle}
              >
                {lineIndex + 1}
              </span>
            )}
            {line.map((token, tokenIndex) => (
              <span key={tokenIndex} style={{ color: token.color }}>
                {token.content}
              </span>
            ))}
            {lineIndex < tokens.tokens.length - 1 && "\n"}
          </span>
        ))}
      </code>
    </PreTag>
  );
}
