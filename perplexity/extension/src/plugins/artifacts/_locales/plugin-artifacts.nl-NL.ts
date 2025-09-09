import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Klik om {name:enum} te bekijken", {
      enum: {
        name: {
          markdown: "inhoud",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "webpagina",
          react: "webpagina",
          markmap: "mindmap",
        },
      },
    }),
  },
  version: "Versie {number:number}",
  toggle: {
    preview: "Voorbeeld",
    markdown: "Ruwe tekst",
    code: "Code",
  },
  list: {
    title: "Artefacten in deze thread",
    generating: "Genereren...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versie",
          other: "{?} versies",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Vernieuwen",
    openList: "Artefactenlijst openen",
    openInCodeSandbox: "Openen in CodeSandbox",
    openInMermaid: "Openen in Mermaid Live Editor",
    downloadSvg: "SVG downloaden",
    downloadAsInteractiveHtml: "Downloaden als interactieve HTML",
    viewAsInteractiveHtml: "Bekijken als interactieve HTML",
  },
  error: {
    noSvg: "Geen SVG gevonden",
    previewUrl: "Kan voorbeeld-URL niet genereren",
  },
} as const satisfies Translations;
