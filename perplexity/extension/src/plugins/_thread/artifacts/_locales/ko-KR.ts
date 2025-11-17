import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("{name:enum}을(를) 보려면 클릭하세요", {
      enum: {
        name: {
          markdown: "콘텐츠",
          mermaid: "다이어그램",
          plantuml: "다이어그램",
          html: "웹 페이지",
          react: "웹 페이지",
          markmap: "마인드맵",
        },
      },
    }),
  },
  version: "버전 {number:number}",
  toggle: {
    preview: "미리보기",
    markdown: "원시 텍스트",
    code: "코드",
  },
  list: {
    title: "이 스레드의 아티팩트",
    generating: "생성 중...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 버전",
          other: "{?} 버전",
        },
      },
    }),
  },
  tooltip: {
    refresh: "새로고침",
    openList: "아티팩트 목록 열기",
    openInCodeSandbox: "CodeSandbox에서 열기",
    openInMermaid: "Mermaid Live Editor에서 열기",
    downloadSvg: "SVG 다운로드",
    downloadAsInteractiveHtml: "인터랙티브 HTML로 다운로드",
    viewAsInteractiveHtml: "인터랙티브 HTML로 보기",
  },
  error: {
    noSvg: "SVG를 찾을 수 없음",
    previewUrl: "미리보기 URL 생성 실패",
  },
} as const satisfies Translations;
