import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Afișează previzualizări",
    hidePreviews: "Ascunde previzualizări",
  },
  input: {
    searchPlaceholder: "Căutare...",
  },
  actions: {
    createNewThread: "Creează fir nou",
    toggleIncognitoEnable: "Activează modul incognito",
    toggleIncognitoDisable: "Dezactivează modul incognito",
    toggleLightMode: "Schimbă la modul luminos",
    toggleDarkMode: "Schimbă la modul întunecat",
  },
  navigation: {
    home: "Acasă",
    library: "Bibliotecă",
    spaces: "Spații",
    discover: "Descoperă",
    settings: "Setări",
    labs: "Laboratoare",
    current: "Curent",
    openInNewTab: "Deschide în tab nou",
    goTo: "Du-te la {destination}",
  },
  search: {
    threads: "Fire",
    spaces: "Spații",
    threadsPlaceholder: "Caută fire...",
    spacesPlaceholder: "Caută spații...",
  },
  groups: {
    actions: "Acțiuni",
    navigation: "Navigare",
    search: "Căutare",
  },
  spaces: {
    footer: {
      openInNewTab: "Deschide în tab nou",
      searchInSpace: "Caută în spațiu",
      goToSpace: "Du-te la spațiu",
      searchSpacePlaceholder: "Caută {spaceName}...",
    },
    commandItems: {
      errorFetching: "Eroare la preluarea spațiilor",
      noSpacesFound: "Nu s-au găsit spații",
    },
    preview: {
      description: "Descriere",
      instructions: "Instrucțiuni",
      files: "Fișiere ({count:number})",
      webLinks: "Link-uri web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Eroare la preluarea firelor",
      noThreadsFound: "Nu s-au găsit fire",
    },
    filters: {
      sort: {
        newest: "Cele mai noi",
        newestFirst: "Cele mai noi primul",
        oldest: "Cele mai vechi",
        oldestFirst: "Cele mai vechi primul",
        label: "Sortează:",
      },
      source: {
        all: "Toate",
        label: "Sursă:",
      },
      temporaryThreads: {
        show: "Afișează",
        hide: "Ascunde",
        label: "Fire temporare:",
        placeholder: "Fire temporare",
      },
      type: {
        all: "Toate",
        label: "Tip:",
        placeholder: "Tip",
      },
    },
  },
  common: {
    noResults: "Nu s-au găsit rezultate",
    current: "Curent",
  },
} as const satisfies Translations;
