import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Кликните да видите {name:enum}", {
      enum: {
        name: {
          markdown: "садржај",
          mermaid: "дијаграм",
          plantuml: "дијаграм",
          html: "веб страницу",
          react: "веб страницу",
          markmap: "менталну мапу",
        },
      },
    }),
  },
  version: "Верзија {number:number}",
  toggle: {
    preview: "Преглед",
    markdown: "Сирови текст",
    code: "Код",
  },
  list: {
    title: "Артефакти у овој теми",
    generating: "Генерисање...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 верзија",
          other: "{?} верзија",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Освежи",
    openList: "Отвори листу артефаката",
    openInCodeSandbox: "Отвори у CodeSandbox-у",
    openInMermaid: "Отвори у Mermaid Live Editor-у",
    downloadSvg: "Преузми SVG",
    downloadAsInteractiveHtml: "Преузми као интерактивни HTML",
    viewAsInteractiveHtml: "Погледај као интерактивни HTML",
  },
  error: {
    noSvg: "Није пронађен SVG",
    previewUrl: "Неуспешно генерисање URL-а за преглед",
  },
} as const satisfies Translations;
