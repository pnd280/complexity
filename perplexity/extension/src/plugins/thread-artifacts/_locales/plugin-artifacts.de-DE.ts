import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/thread-artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Klicken, um {name:enum} anzuzeigen", {
      enum: {
        name: {
          markdown: "Inhalt",
          mermaid: "Diagramm",
          plantuml: "Diagramm",
          html: "Webseite",
          react: "Webseite",
          markmap: "Mindmap",
        },
      },
    }),
  },
  version: "Version {number:number}",
  toggle: {
    preview: "Vorschau",
    markdown: "Rohtext",
    code: "Code",
  },
  list: {
    title: "Artefakte in diesem Thread",
    generating: "Wird generiert...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 Version",
          other: "{?} Versionen",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Aktualisieren",
    openList: "Artefaktliste öffnen",
    openInCodeSandbox: "In CodeSandbox öffnen",
    openInMermaid: "Im Mermaid Live Editor öffnen",
    downloadSvg: "SVG herunterladen",
    downloadAsInteractiveHtml: "Als interaktives HTML herunterladen",
    viewAsInteractiveHtml: "Als interaktives HTML anzeigen",
  },
  error: {
    noSvg: "Kein SVG gefunden",
    previewUrl: "Vorschau-URL konnte nicht generiert werden",
  },
} as const satisfies Translations;
