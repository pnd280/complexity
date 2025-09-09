import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Нажмите, чтобы просмотреть {name:enum}", {
      enum: {
        name: {
          markdown: "содержимое",
          mermaid: "диаграмму",
          plantuml: "диаграмму",
          html: "веб-страницу",
          react: "веб-страницу",
          markmap: "ментальную карту",
        },
      },
    }),
  },
  version: "Версия {number:number}",
  toggle: {
    preview: "Превью",
    markdown: "Исходный текст",
    code: "Код",
  },
  list: {
    title: "Артефакты в этой ветке",
    generating: "Генерация...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 версия",
          2: "2 версии",
          3: "3 версии",
          4: "4 версии",
          other: "{?} версий",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Обновить",
    openList: "Открыть список артефактов",
    openInCodeSandbox: "Открыть в CodeSandbox",
    openInMermaid: "Открыть в редакторе Mermaid Live",
    downloadSvg: "Скачать SVG",
    downloadAsInteractiveHtml: "Скачать как интерактивный HTML",
    viewAsInteractiveHtml: "Просмотреть как интерактивный HTML",
  },
  error: {
    noSvg: "SVG не найден",
    previewUrl: "Не удалось создать URL превью",
  },
} as const satisfies Translations;
