export const ARTIFACT_LANGUAGES = {
  markdown: "markdown",
  mermaid: "mermaid",
  markmap: "markmap",
  html: "html",
  svg: "html",
  md: "markdown",
  mmd: "mermaid",
  react: "react",
  plantuml: "plantuml",
} as const satisfies Partial<Record<string, string>>;

export type ArtifactLanguage = keyof typeof ARTIFACT_LANGUAGES;

export type ArtifactState = "preview" | "code";
