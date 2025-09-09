import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Zobrazit náhledy",
    hidePreviews: "Skrýt náhledy",
  },
  input: {
    searchPlaceholder: "Hledat...",
  },
  actions: {
    createNewThread: "Vytvořit nové vlákno",
    toggleIncognitoEnable: "Zapnout režim inkognito",
    toggleIncognitoDisable: "Vypnout režim inkognito",
    toggleLightMode: "Přepnout na světlý režim",
    toggleDarkMode: "Přepnout na tmavý režim",
  },
  navigation: {
    home: "Domů",
    library: "Knihovna",
    spaces: "Prostory",
    discover: "Objevit",
    settings: "Nastavení",
    labs: "Laboratoře",
    current: "Aktuální",
    openInNewTab: "Otevřít v nové kartě",
    goTo: "Přejít na {destination}",
  },
  search: {
    threads: "Vlákna",
    spaces: "Prostory",
    threadsPlaceholder: "Hledat vlákna...",
    spacesPlaceholder: "Hledat prostory...",
  },
  groups: {
    actions: "Akce",
    navigation: "Navigace",
    search: "Hledání",
  },
  spaces: {
    footer: {
      openInNewTab: "Otevřít v nové kartě",
      searchInSpace: "Hledat v prostoru",
      goToSpace: "Přejít do prostoru",
      searchSpacePlaceholder: "Hledat {spaceName}...",
    },
    commandItems: {
      errorFetching: "Chyba při načítání prostorů",
      noSpacesFound: "Nenalezeny žádné prostory",
    },
    preview: {
      description: "Popis",
      instructions: "Pokyny",
      files: "Soubory ({count:number})",
      webLinks: "Webové odkazy ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Chyba při načítání vláken",
      noThreadsFound: "Nenalezena žádná vlákna",
    },
    filters: {
      sort: {
        newest: "Nejnovější",
        newestFirst: "Nejnovější první",
        oldest: "Nejstarší",
        oldestFirst: "Nejstarší první",
        label: "Seřadit:",
      },
      source: {
        all: "Vše",
        label: "Zdroj:",
      },
      temporaryThreads: {
        show: "Zobrazit",
        hide: "Skrýt",
        label: "Dočasná vlákna:",
        placeholder: "Dočasná vlákna",
      },
      type: {
        all: "Vše",
        label: "Typ:",
        placeholder: "Typ",
      },
    },
  },
  common: {
    noResults: "Nenalezeny žádné výsledky",
    current: "Aktuální",
  },
} as const satisfies Translations;
