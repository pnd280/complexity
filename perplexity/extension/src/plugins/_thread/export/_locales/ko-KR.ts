import type { Translations } from "@/plugins/_thread/export/_locales/index";

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
  waiting: {
    title: "잠시 기다려주세요...",
    description: "내용을 추출 중입니다. 잠시 시간이 걸릴 수 있습니다",
  },
  errors: {
    downloadFailed: {
      title: "❌ 다운로드 실패",
      unknownError: "알 수 없는 오류가 발생했습니다",
    },
    copyFailed: {
      title: "❌ 복사 실패",
      unknownError: "알 수 없는 오류가 발생했습니다",
    },
  },
} as const satisfies Translations;
