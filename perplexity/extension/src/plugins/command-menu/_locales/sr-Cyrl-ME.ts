import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Прикажи прегледе",
    hidePreviews: "Сакриј прегледе",
  },
  input: {
    searchPlaceholder: "Претрага...",
  },
  actions: {
    createNewThread: "Створи нову нит",
    toggleIncognitoEnable: "Укључи инкогнито режим",
    toggleIncognitoDisable: "Искључи инкогнито режим",
    toggleLightMode: "Промени на светли режим",
    toggleDarkMode: "Промени на тамни режим",
  },
  navigation: {
    home: "Почетна",
    library: "Библиотека",
    spaces: "Простори",
    discover: "Откривај",
    settings: "Подешавања",
    labs: "Лабораторије",
    current: "Тренутно",
    openInNewTab: "Отвори у новом табу",
    goTo: "Иди на {destination}",
  },
  search: {
    threads: "Нити",
    spaces: "Простори",
    threadsPlaceholder: "Претражи нити...",
    spacesPlaceholder: "Претражи просторе...",
  },
  groups: {
    actions: "Акције",
    navigation: "Навигација",
    search: "Претрага",
  },
  spaces: {
    footer: {
      copyId: "Копирај ID",
      copyIdSuccess: "✅ ID копиран у привремену меморију",
      openInNewTab: "Отвори у новом табу",
      searchInSpace: "Претражи у простору",
      goToSpace: "Иди у простор",
      searchSpacePlaceholder: "Претражи {spaceName}...",
    },
    commandItems: {
      errorFetching: "Грешка при дохватању простора",
      noSpacesFound: "Нема пронађених простора",
    },
    preview: {
      description: "Опис",
      instructions: "Упутства",
      files: "Фајлови ({count:number})",
      webLinks: "Веб линкови ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Грешка при дохватању нити",
      noThreadsFound: "Нема пронађених нити",
    },
    filters: {
      sort: {
        newest: "Најновије",
        newestFirst: "Најновије прво",
        oldest: "Најстарије",
        oldestFirst: "Најстарије прво",
        label: "Сортирај:",
      },
      source: {
        all: "Све",
        label: "Извор:",
      },
      temporaryThreads: {
        show: "Прикажи",
        hide: "Сакриј",
        label: "Привремене нити:",
        placeholder: "Привремене нити",
      },
      type: {
        all: "Све",
        label: "Тип:",
        placeholder: "Тип",
      },
    },
  },
  common: {
    noResults: "Нема резултата",
    current: "Тренутно",
    expires: "Истиче {date}",
  },
} as const satisfies Translations;
