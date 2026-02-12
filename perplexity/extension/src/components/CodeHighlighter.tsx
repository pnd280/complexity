import type { ElementType, ReactNode, RefObject } from "react";
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
  PreTag?: ElementType<{ children: ReactNode }>;
};

export default function CodeHighlighter({
  children,
  language,
  colorScheme,
  codeRef,
  showLineNumbers,
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
      <code
        ref={codeRef}
        className="x:font-mono"
        style={{
          color: fgColor,
          ...(showLineNumbers && { counterReset: "line" }),
        }}
      >
        {tokens.tokens.map((line, lineIndex) => (
          <span
            key={lineIndex}
            className={
              showLineNumbers
                ? "line x:before:inline-block x:before:w-8 x:before:pr-4 x:before:text-right x:before:opacity-50 x:before:content-[counter(line)] x:before:select-none"
                : "line"
            }
            style={showLineNumbers ? { counterIncrement: "line" } : undefined}
          >
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
