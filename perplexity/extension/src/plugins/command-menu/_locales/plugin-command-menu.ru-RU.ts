import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Показать превью",
    hidePreviews: "Скрыть превью",
  },
  input: {
    searchPlaceholder: "Поиск...",
  },
  actions: {
    createNewThread: "Создать новую ветку",
    toggleIncognitoEnable: "Включить режим инкогнито",
    toggleIncognitoDisable: "Отключить режим инкогнито",
    toggleLightMode: "Переключить на светлый режим",
    toggleDarkMode: "Переключить на тёмный режим",
  },
  navigation: {
    home: "Главная",
    library: "Библиотека",
    spaces: "Пространства",
    discover: "Обзор",
    settings: "Настройки",
    labs: "Лаборатории",
    current: "Текущий",
    openInNewTab: "Открыть в новой вкладке",
    goTo: "Перейти к {destination}",
  },
  search: {
    threads: "Ветки",
    spaces: "Пространства",
    threadsPlaceholder: "Поиск веток...",
    spacesPlaceholder: "Поиск пространств...",
  },
  groups: {
    actions: "Действия",
    navigation: "Навигация",
    search: "Поиск",
  },
  spaces: {
    footer: {
      openInNewTab: "Открыть в новой вкладке",
      searchInSpace: "Поиск в пространстве",
      goToSpace: "Перейти в пространство",
      searchSpacePlaceholder: "Поиск {spaceName}...",
    },
    commandItems: {
      errorFetching: "Ошибка получения пространств",
      noSpacesFound: "Пространства не найдены",
    },
    preview: {
      description: "Описание",
      instructions: "Инструкции",
      files: "Файлы ({count:number})",
      webLinks: "Веб-ссылки ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Ошибка получения веток",
      noThreadsFound: "Ветки не найдены",
    },
    filters: {
      sort: {
        newest: "Новейшие",
        newestFirst: "Новейшие сначала",
        oldest: "Старейшие",
        oldestFirst: "Старейшие сначала",
        label: "Сортировка:",
      },
      source: {
        all: "Все",
        label: "Источник:",
      },
      temporaryThreads: {
        show: "Показать",
        hide: "Скрыть",
        label: "Временные ветки:",
        placeholder: "Временные ветки",
      },
      type: {
        all: "Все",
        label: "Тип:",
        placeholder: "Тип",
      },
    },
  },
  common: {
    noResults: "Результаты не найдены",
    current: "Текущий",
  },
} as const satisfies Translations;
