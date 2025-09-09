import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("点击查看{name:enum}", {
      enum: {
        name: {
          markdown: "内容",
          mermaid: "图表",
          plantuml: "图表",
          html: "网页",
          react: "网页",
          markmap: "思维导图",
        },
      },
    }),
  },
  version: "版本 {number:number}",
  toggle: {
    preview: "预览",
    markdown: "原始文本",
    code: "代码",
  },
  list: {
    title: "此主题中的构件",
    generating: "生成中...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 个版本",
          other: "{?} 个版本",
        },
      },
    }),
  },
  tooltip: {
    refresh: "刷新",
    openList: "打开构件列表",
    openInCodeSandbox: "在 CodeSandbox 中打开",
    openInMermaid: "在 Mermaid Live Editor 中打开",
    downloadSvg: "下载 SVG",
    downloadAsInteractiveHtml: "下载为交互式 HTML",
    viewAsInteractiveHtml: "查看为交互式 HTML",
  },
  error: {
    noSvg: "未找到 SVG",
    previewUrl: "生成预览 URL 失败",
  },
} as const satisfies Translations;
