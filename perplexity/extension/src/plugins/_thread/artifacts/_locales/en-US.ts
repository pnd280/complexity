import { dt, type LanguageMessages } from "@complexity/i18n";

export default {
  placeholder: {
    description: dt("Click to view {name:enum}", {
      enum: {
        name: {
          markdown: "content",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "web page",
          react: "web page",
          markmap: "mindmap",
        },
      },
    }),
  },
  version: "Version {number:number}",
  toggle: {
    preview: "Preview",
    markdown: "Raw text",
    code: "Code",
  },
  list: {
    title: "Artifacts in this thread",
    generating: "Generating...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 version",
          other: "{?} versions",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Refresh",
    openList: "Open Artifacts List",
    openInCodeSandbox: "Open in CodeSandbox",
    openInMermaid: "Open in Mermaid Live Editor",
    downloadSvg: "Download SVG",
    downloadAsInteractiveHtml: "Download as interactive HTML",
    viewAsInteractiveHtml: "View as interactive HTML",
  },
  error: {
    noSvg: "No SVG found",
    previewUrl: "Failed to generate preview URL",
  },
} as const satisfies LanguageMessages;
