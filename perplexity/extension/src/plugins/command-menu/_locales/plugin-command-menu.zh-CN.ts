import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "显示预览",
    hidePreviews: "隐藏预览",
  },
  input: {
    searchPlaceholder: "搜索...",
  },
  actions: {
    createNewThread: "创建新线程",
    toggleIncognitoEnable: "启用隐身模式",
    toggleIncognitoDisable: "禁用隐身模式",
    toggleLightMode: "切换到浅色模式",
    toggleDarkMode: "切换到深色模式",
  },
  navigation: {
    home: "首页",
    library: "资料库",
    spaces: "空间",
    discover: "发现",
    settings: "设置",
    labs: "实验室",
    current: "当前",
    openInNewTab: "在新标签页中打开",
    goTo: "前往 {destination}",
  },
  search: {
    threads: "线程",
    spaces: "空间",
    threadsPlaceholder: "搜索线程...",
    spacesPlaceholder: "搜索空间...",
  },
  groups: {
    actions: "操作",
    navigation: "导航",
    search: "搜索",
  },
  spaces: {
    footer: {
      copyId: "复制 ID",
      copyIdSuccess: "✅ ID 已复制到剪贴板",
      openInNewTab: "在新标签页中打开",
      searchInSpace: "在空间中搜索",
      goToSpace: "前往空间",
      searchSpacePlaceholder: "搜索 {spaceName}...",
    },
    commandItems: {
      errorFetching: "获取空间时出错",
      noSpacesFound: "未找到空间",
    },
    preview: {
      description: "描述",
      instructions: "说明",
      files: "文件 ({count:number})",
      webLinks: "网页链接 ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "获取线程时出错",
      noThreadsFound: "未找到线程",
    },
    filters: {
      sort: {
        newest: "最新",
        newestFirst: "最新优先",
        oldest: "最旧",
        oldestFirst: "最旧优先",
        label: "排序：",
      },
      source: {
        all: "全部",
        label: "来源：",
      },
      temporaryThreads: {
        show: "显示",
        hide: "隐藏",
        label: "临时线程：",
        placeholder: "临时线程",
      },
      type: {
        all: "全部",
        label: "类型：",
        placeholder: "类型",
      },
    },
  },
  common: {
    noResults: "未找到结果",
    current: "当前",
    expires: "于 {date} 过期",
  },
} as const satisfies Translations;
