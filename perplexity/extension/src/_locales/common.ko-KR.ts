import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "프로젝트를 계속 유지하려면 기부해 주세요!",
  },
  sponsorDialog: {
    title: "Complexity를 멋지게 유지하는 데 도움을 주세요!",
    description:
      "수많은 시간이 Complexity를 강력하고 세련된 도구로 만드는 데 쏟아졌습니다. 여러분의 지원은 지속적인 개발, 새로운 기능, 그리고 모든 것이 원활하게 운영되는 데 직접적인 힘이 됩니다.",
    descriptionLine2:
      "Complexity가 여러분의 워크플로우에 가치를 더한다면, 미래를 위해 기여해 주세요!",
    cometAffiliate: {
      title: "무료 <0/>!",
      description:
        "Perplexity의 새로운 브라우저인 Comet을 시도하고 무료 <0/> 구독을 얻으면서 동시에 Complexity 개발에 직접 기여하세요.",
      claimButton: "지금 받기",
      dismissButton: "닫기",
    },
    donation: {
      title: "💖 미래 개발 지원하기",
    },
    sponsorship: {
      title: "🌟 스폰서십에 관심이 있으신가요?",
      contactEmail: "이메일로 문의하기",
    },
  },
  misc: {
    words: "단어",
    characters: "문자",
    rewrite: "다시 쓰기",
    speakAloud: "소리 내어 읽기",
    stop: "중지",
  },
  releaseNotes: {
    title: "v{version}으로 업데이트됨",
    dontShowAgain: "닫기 및 향후 업데이트에 대해 다시 표시하지 않기",
    confirmDialog: {
      title: "확인",
      message:
        "정말로 닫고 향후 업데이트에 대해 다시 표시하지 않으시겠습니까? 설정 페이지에서 언제든지 이 팝업을 다시 활성화할 수 있습니다.",
      cancel: "취소",
      confirm: "이해했습니다",
    },
    dismiss: "닫기",
  },
} as const satisfies Translations;
