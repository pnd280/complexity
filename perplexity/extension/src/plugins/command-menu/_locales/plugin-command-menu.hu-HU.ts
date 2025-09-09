import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Előnézetek megjelenítése",
    hidePreviews: "Előnézetek elrejtése",
  },
  input: {
    searchPlaceholder: "Keresés...",
  },
  actions: {
    createNewThread: "Új szál létrehozása",
    toggleIncognitoEnable: "Inkognitó mód bekapcsolása",
    toggleIncognitoDisable: "Inkognitó mód kikapcsolása",
    toggleLightMode: "Váltás világos módra",
    toggleDarkMode: "Váltás sötét módra",
  },
  navigation: {
    home: "Kezdőlap",
    library: "Könyvtár",
    spaces: "Terek",
    discover: "Felfedezés",
    settings: "Beállítások",
    labs: "Laboratóriumok",
    current: "Jelenlegi",
    openInNewTab: "Megnyitás új lapon",
    goTo: "Ugrás ide: {destination}",
  },
  search: {
    threads: "Szálak",
    spaces: "Terek",
    threadsPlaceholder: "Szálak keresése...",
    spacesPlaceholder: "Terek keresése...",
  },
  groups: {
    actions: "Műveletek",
    navigation: "Navigáció",
    search: "Keresés",
  },
  spaces: {
    footer: {
      openInNewTab: "Megnyitás új lapon",
      searchInSpace: "Keresés a térben",
      goToSpace: "Ugrás a térhez",
      searchSpacePlaceholder: "{spaceName} keresése...",
    },
    commandItems: {
      errorFetching: "Hiba a terek lekérése során",
      noSpacesFound: "Nem találhatók terek",
    },
    preview: {
      description: "Leírás",
      instructions: "Utasítások",
      files: "Fájlok ({count:number})",
      webLinks: "Webes linkek ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Hiba a szálak lekérése során",
      noThreadsFound: "Nem találhatók szálak",
    },
    filters: {
      sort: {
        newest: "Legújabb",
        newestFirst: "Legújabb először",
        oldest: "Legrégebbi",
        oldestFirst: "Legrégebbi először",
        label: "Rendezés:",
      },
      source: {
        all: "Összes",
        label: "Forrás:",
      },
      temporaryThreads: {
        show: "Megjelenítés",
        hide: "Elrejtés",
        label: "Ideiglenes szálak:",
        placeholder: "Ideiglenes szálak",
      },
      type: {
        all: "Összes",
        label: "Típus:",
        placeholder: "Típus",
      },
    },
  },
  common: {
    noResults: "Nincs találat",
    current: "Jelenlegi",
  },
} as const satisfies Translations;
