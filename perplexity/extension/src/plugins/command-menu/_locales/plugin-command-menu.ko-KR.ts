import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "미리보기 표시",
    hidePreviews: "미리보기 숨기기",
  },
  input: {
    searchPlaceholder: "검색...",
  },
  actions: {
    createNewThread: "새 스레드 만들기",
    toggleIncognitoEnable: "시크릿 모드 활성화",
    toggleIncognitoDisable: "시크릿 모드 비활성화",
    toggleLightMode: "라이트 모드로 변경",
    toggleDarkMode: "다크 모드로 변경",
  },
  navigation: {
    home: "홈",
    library: "라이브러리",
    spaces: "공간",
    discover: "발견",
    settings: "설정",
    labs: "실험실",
    current: "현재",
    openInNewTab: "새 탭에서 열기",
    goTo: "{destination}로 이동",
  },
  search: {
    threads: "스레드",
    spaces: "공간",
    threadsPlaceholder: "스레드 검색...",
    spacesPlaceholder: "공간 검색...",
  },
  groups: {
    actions: "작업",
    navigation: "탐색",
    search: "검색",
  },
  spaces: {
    footer: {
      openInNewTab: "새 탭에서 열기",
      searchInSpace: "공간에서 검색",
      goToSpace: "공간으로 이동",
      searchSpacePlaceholder: "{spaceName} 검색...",
    },
    commandItems: {
      errorFetching: "공간 가져오기 오류",
      noSpacesFound: "공간을 찾을 수 없음",
    },
    preview: {
      description: "설명",
      instructions: "지침",
      files: "파일 ({count:number})",
      webLinks: "웹 링크 ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "스레드 가져오기 오류",
      noThreadsFound: "스레드를 찾을 수 없음",
    },
    filters: {
      sort: {
        newest: "최신",
        newestFirst: "최신 순",
        oldest: "오래된",
        oldestFirst: "오래된 순",
        label: "정렬:",
      },
      source: {
        all: "전체",
        label: "소스:",
      },
      temporaryThreads: {
        show: "표시",
        hide: "숨기기",
        label: "임시 스레드:",
        placeholder: "임시 스레드",
      },
      type: {
        all: "전체",
        label: "유형:",
        placeholder: "유형",
      },
    },
  },
  common: {
    noResults: "결과를 찾을 수 없음",
    current: "현재",
  },
} as const satisfies Translations;
