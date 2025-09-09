import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Prikaži preglede",
    hidePreviews: "Sakrij preglede",
  },
  input: {
    searchPlaceholder: "Pretraži...",
  },
  actions: {
    createNewThread: "Stvori novu nit",
    toggleIncognitoEnable: "Uključi incognito način",
    toggleIncognitoDisable: "Isključi incognito način",
    toggleLightMode: "Promijeni na svijetli način",
    toggleDarkMode: "Promijeni na tamni način",
  },
  navigation: {
    home: "Početna",
    library: "Biblioteka",
    spaces: "Prostori",
    discover: "Otkrivaj",
    settings: "Postavke",
    labs: "Laboratoriji",
    current: "Trenutno",
    openInNewTab: "Otvori u novoj kartici",
    goTo: "Idi na {destination}",
  },
  search: {
    threads: "Niti",
    spaces: "Prostori",
    threadsPlaceholder: "Pretraži niti...",
    spacesPlaceholder: "Pretraži prostore...",
  },
  groups: {
    actions: "Akcije",
    navigation: "Navigacija",
    search: "Pretraživanje",
  },
  spaces: {
    footer: {
      openInNewTab: "Otvori u novoj kartici",
      searchInSpace: "Pretraži u prostoru",
      goToSpace: "Idi u prostor",
      searchSpacePlaceholder: "Pretraži {spaceName}...",
    },
    commandItems: {
      errorFetching: "Greška pri dohvaćanju prostora",
      noSpacesFound: "Nema pronađenih prostora",
    },
    preview: {
      description: "Opis",
      instructions: "Upute",
      files: "Datoteke ({count:number})",
      webLinks: "Web linkovi ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Greška pri dohvaćanju niti",
      noThreadsFound: "Nema pronađenih niti",
    },
    filters: {
      sort: {
        newest: "Najnovije",
        newestFirst: "Najnovije prvo",
        oldest: "Najstarije",
        oldestFirst: "Najstarije prvo",
        label: "Sortiraj:",
      },
      source: {
        all: "Sve",
        label: "Izvor:",
      },
      temporaryThreads: {
        show: "Prikaži",
        hide: "Sakrij",
        label: "Privremene niti:",
        placeholder: "Privremene niti",
      },
      type: {
        all: "Sve",
        label: "Tip:",
        placeholder: "Tip",
      },
    },
  },
  common: {
    noResults: "Nema rezultata",
    current: "Trenutno",
  },
} as const satisfies Translations;
