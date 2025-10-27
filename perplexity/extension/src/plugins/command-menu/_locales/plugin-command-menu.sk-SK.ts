import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Zobraziť náhľady",
    hidePreviews: "Skryť náhľady",
  },
  input: {
    searchPlaceholder: "Hľadať...",
  },
  actions: {
    createNewThread: "Vytvoriť nové vlákno",
    toggleIncognitoEnable: "Zapnúť inkognito režim",
    toggleIncognitoDisable: "Vypnúť inkognito režim",
    toggleLightMode: "Prepnúť na svetlý režim",
    toggleDarkMode: "Prepnúť na tmavý režim",
  },
  navigation: {
    home: "Domov",
    library: "Knižnica",
    spaces: "Priestory",
    discover: "Objaviť",
    settings: "Nastavenia",
    labs: "Laboratóriá",
    current: "Aktuálne",
    openInNewTab: "Otvoriť v novej karte",
    goTo: "Prejsť na {destination}",
  },
  search: {
    threads: "Vlákna",
    spaces: "Priestory",
    threadsPlaceholder: "Hľadať vlákna...",
    spacesPlaceholder: "Hľadať priestory...",
  },
  groups: {
    actions: "Akcie",
    navigation: "Navigácia",
    search: "Hľadanie",
  },
  spaces: {
    footer: {
      copyId: "Kopírovať ID",
      copyIdSuccess: "✅ ID skopírované do schránky",
      openInNewTab: "Otvoriť v novej karte",
      searchInSpace: "Hľadať v priestore",
      goToSpace: "Prejsť do priestoru",
      searchSpacePlaceholder: "Hľadať {spaceName}...",
    },
    commandItems: {
      errorFetching: "Chyba pri načítavaní priestorov",
      noSpacesFound: "Nenašli sa žiadne priestory",
    },
    preview: {
      description: "Popis",
      instructions: "Pokyny",
      files: "Súbory ({count:number})",
      webLinks: "Webové odkazy ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Chyba pri načítavaní vlákien",
      noThreadsFound: "Nenašli sa žiadne vlákna",
    },
    filters: {
      sort: {
        newest: "Najnovšie",
        newestFirst: "Najnovšie prvé",
        oldest: "Najstaršie",
        oldestFirst: "Najstaršie prvé",
        label: "Zoradiť:",
      },
      source: {
        all: "Všetko",
        label: "Zdroj:",
      },
      temporaryThreads: {
        show: "Zobraziť",
        hide: "Skryť",
        label: "Dočasné vlákna:",
        placeholder: "Dočasné vlákna",
      },
      type: {
        all: "Všetko",
        label: "Typ:",
        placeholder: "Typ",
      },
    },
  },
  common: {
    noResults: "Nenašli sa žiadne výsledky",
    current: "Aktuálne",
    expires: "Vypršie {date}",
  },
} as const satisfies Translations;
