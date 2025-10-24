import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "プレビューを表示",
    hidePreviews: "プレビューを非表示",
  },
  input: {
    searchPlaceholder: "検索...",
  },
  actions: {
    createNewThread: "新しいスレッドを作成",
    toggleIncognitoEnable: "シークレットモードを有効にする",
    toggleIncognitoDisable: "シークレットモードを無効にする",
    toggleLightMode: "ライトモードに変更",
    toggleDarkMode: "ダークモードに変更",
  },
  navigation: {
    home: "ホーム",
    library: "ライブラリ",
    spaces: "スペース",
    discover: "発見",
    settings: "設定",
    labs: "ラボ",
    current: "現在",
    openInNewTab: "新しいタブで開く",
    goTo: "{destination}に移動",
  },
  search: {
    threads: "スレッド",
    spaces: "スペース",
    threadsPlaceholder: "スレッドを検索...",
    spacesPlaceholder: "スペースを検索...",
  },
  groups: {
    actions: "アクション",
    navigation: "ナビゲーション",
    search: "検索",
  },
  spaces: {
    footer: {
      copyId: "IDをコピー",
      copyIdSuccess: "✅ IDをクリップボードにコピーしました",
      openInNewTab: "新しいタブで開く",
      searchInSpace: "スペース内を検索",
      goToSpace: "スペースに移動",
      searchSpacePlaceholder: "{spaceName}を検索...",
    },
    commandItems: {
      errorFetching: "スペースの取得エラー",
      noSpacesFound: "スペースが見つかりません",
    },
    preview: {
      description: "説明",
      instructions: "手順",
      files: "ファイル ({count:number})",
      webLinks: "ウェブリンク ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "スレッドの取得エラー",
      noThreadsFound: "スレッドが見つかりません",
    },
    filters: {
      sort: {
        newest: "最新",
        newestFirst: "最新順",
        oldest: "最古",
        oldestFirst: "最古順",
        label: "並び替え:",
      },
      source: {
        all: "すべて",
        label: "ソース:",
      },
      temporaryThreads: {
        show: "表示",
        hide: "非表示",
        label: "一時的なスレッド:",
        placeholder: "一時的なスレッド",
      },
      type: {
        all: "すべて",
        label: "タイプ:",
        placeholder: "タイプ",
      },
    },
  },
  common: {
    noResults: "結果が見つかりません",
    current: "現在",
  },
} as const satisfies Translations;
