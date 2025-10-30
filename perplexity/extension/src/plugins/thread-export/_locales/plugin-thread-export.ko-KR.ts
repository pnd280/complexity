import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "내보내기",
  format: {
    label: "형식 선택",
    placeholder: "형식을 선택하세요",
  },
  includeCitations: "인용 포함",
  actions: {
    download: "다운로드",
    largeFileDownloadPrompt: {
      title: "다운로드가 준비되었습니다",
      description: "여기를 클릭하여 다운로드를 시작하세요",
    },
    copy: "복사",
  },
  errors: {
    downloadFailed: {
      title: "❌ 다운로드 실패",
      unknownError: "알 수 없는 오류가 발생했습니다",
    },
  },
} as const satisfies Translations;
