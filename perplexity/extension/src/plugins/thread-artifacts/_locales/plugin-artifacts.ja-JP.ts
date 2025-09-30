import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/thread-artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("クリックして{name:enum}を表示", {
      enum: {
        name: {
          markdown: "コンテンツ",
          mermaid: "ダイアグラム",
          plantuml: "ダイアグラム",
          html: "ウェブページ",
          react: "ウェブページ",
          markmap: "マインドマップ",
        },
      },
    }),
  },
  version: "バージョン {number:number}",
  toggle: {
    preview: "プレビュー",
    markdown: "生テキスト",
    code: "コード",
  },
  list: {
    title: "このスレッドのアーティファクト",
    generating: "生成中...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1バージョン",
          other: "{?}バージョン",
        },
      },
    }),
  },
  tooltip: {
    refresh: "更新",
    openList: "アーティファクト一覧を開く",
    openInCodeSandbox: "CodeSandboxで開く",
    openInMermaid: "Mermaid Live Editorで開く",
    downloadSvg: "SVGをダウンロード",
    downloadAsInteractiveHtml: "インタラクティブHTMLとしてダウンロード",
    viewAsInteractiveHtml: "インタラクティブHTMLとして表示",
  },
  error: {
    noSvg: "SVGが見つかりません",
    previewUrl: "プレビューURLの生成に失敗しました",
  },
} as const satisfies Translations;
