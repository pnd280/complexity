import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Kliknite za prikaz {name:enum}", {
      enum: {
        name: {
          markdown: "sadržaja",
          mermaid: "dijagrama",
          plantuml: "dijagrama",
          html: "web stranice",
          react: "web stranice",
          markmap: "mentalne mape",
        },
      },
    }),
  },
  version: "Verzija {number:number}",
  toggle: {
    preview: "Pregled",
    markdown: "Sirovi tekst",
    code: "Kod",
  },
  list: {
    title: "Artefakti u ovoj temi",
    generating: "Generiranje...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 verzija",
          other: "{?} verzija",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Osvježi",
    openList: "Otvori popis artefakata",
    openInCodeSandbox: "Otvori u CodeSandbox",
    openInMermaid: "Otvori u Mermaid Live Editor",
    downloadSvg: "Preuzmi SVG",
    downloadAsInteractiveHtml: "Preuzmi kao interaktivni HTML",
    viewAsInteractiveHtml: "Prikaži kao interaktivni HTML",
  },
  error: {
    noSvg: "SVG nije pronađen",
    previewUrl: "Neuspješno generiranje URL-a za pregled",
  },
} as const satisfies Translations;
