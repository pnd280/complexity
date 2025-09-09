import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("點擊查看{name:enum}", {
      enum: {
        name: {
          markdown: "內容",
          mermaid: "圖表",
          plantuml: "圖表",
          html: "網頁",
          react: "網頁",
          markmap: "思維導圖",
        },
      },
    }),
  },
  version: "版本 {number:number}",
  toggle: {
    preview: "預覽",
    markdown: "原始文字",
    code: "程式碼",
  },
  list: {
    title: "此主題中的構件",
    generating: "產生中...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 個版本",
          other: "{?} 個版本",
        },
      },
    }),
  },
  tooltip: {
    refresh: "重新整理",
    openList: "開啟構件清單",
    openInCodeSandbox: "在 CodeSandbox 中開啟",
    openInMermaid: "在 Mermaid Live Editor 中開啟",
    downloadSvg: "下載 SVG",
    downloadAsInteractiveHtml: "下載為互動式 HTML",
    viewAsInteractiveHtml: "檢視為互動式 HTML",
  },
  error: {
    noSvg: "未找到 SVG",
    previewUrl: "產生預覽 URL 失敗",
  },
} as const satisfies Translations;
