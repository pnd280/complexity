import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "顯示預覽",
    hidePreviews: "隱藏預覽",
  },
  input: {
    searchPlaceholder: "搜尋...",
  },
  actions: {
    createNewThread: "建立新討論串",
    toggleIncognitoEnable: "啟用無痕模式",
    toggleIncognitoDisable: "停用無痕模式",
    toggleLightMode: "切換至淺色模式",
    toggleDarkMode: "切換至深色模式",
  },
  navigation: {
    home: "首頁",
    library: "資料庫",
    spaces: "空間",
    discover: "探索",
    settings: "設定",
    labs: "實驗室",
    current: "目前",
    openInNewTab: "在新分頁中開啟",
    goTo: "前往 {destination}",
  },
  search: {
    threads: "討論串",
    spaces: "空間",
    threadsPlaceholder: "搜尋討論串...",
    spacesPlaceholder: "搜尋空間...",
  },
  groups: {
    actions: "動作",
    navigation: "導覽",
    search: "搜尋",
  },
  spaces: {
    footer: {
      copyId: "複製 ID",
      copyIdSuccess: "✅ ID 已複製到剪貼板",
      openInNewTab: "在新分頁中開啟",
      searchInSpace: "在空間中搜尋",
      goToSpace: "前往空間",
      searchSpacePlaceholder: "搜尋 {spaceName}...",
    },
    commandItems: {
      errorFetching: "取得空間時發生錯誤",
      noSpacesFound: "找不到空間",
    },
    preview: {
      description: "描述",
      instructions: "說明",
      files: "檔案 ({count:number})",
      webLinks: "網頁連結 ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "取得討論串時發生錯誤",
      noThreadsFound: "找不到討論串",
    },
    filters: {
      sort: {
        newest: "最新",
        newestFirst: "最新優先",
        oldest: "最舊",
        oldestFirst: "最舊優先",
        label: "排序：",
      },
      source: {
        all: "全部",
        label: "來源：",
      },
      temporaryThreads: {
        show: "顯示",
        hide: "隱藏",
        label: "暫時討論串：",
        placeholder: "暫時討論串",
      },
      type: {
        all: "全部",
        label: "類型：",
        placeholder: "類型",
      },
    },
  },
  common: {
    noResults: "找不到結果",
    current: "目前",
  },
} as const satisfies Translations;
