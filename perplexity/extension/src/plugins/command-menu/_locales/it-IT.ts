import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Mostra anteprime",
    hidePreviews: "Nascondi anteprime",
  },
  input: {
    searchPlaceholder: "Cerca...",
  },
  actions: {
    createNewThread: "Crea nuovo thread",
    toggleIncognitoEnable: "Abilita modalità incognito",
    toggleIncognitoDisable: "Disabilita modalità incognito",
    toggleLightMode: "Cambia in modalità chiara",
    toggleDarkMode: "Cambia in modalità scura",
  },
  navigation: {
    home: "Home",
    library: "Libreria",
    spaces: "Spazi",
    discover: "Scopri",
    settings: "Impostazioni",
    labs: "Laboratori",
    current: "Corrente",
    openInNewTab: "Apri in nuova scheda",
    goTo: "Vai a {destination}",
  },
  search: {
    threads: "Thread",
    spaces: "Spazi",
    threadsPlaceholder: "Cerca thread...",
    spacesPlaceholder: "Cerca spazi...",
  },
  groups: {
    actions: "Azioni",
    navigation: "Navigazione",
    search: "Ricerca",
  },
  spaces: {
    footer: {
      copyId: "Copia ID",
      copyIdSuccess: "✅ ID copiato negli appunti",
      openInNewTab: "Apri in nuova scheda",
      searchInSpace: "Cerca nello spazio",
      goToSpace: "Vai allo spazio",
      searchSpacePlaceholder: "Cerca {spaceName}...",
    },
    commandItems: {
      errorFetching: "Errore nel recupero degli spazi",
      noSpacesFound: "Nessuno spazio trovato",
    },
    preview: {
      description: "Descrizione",
      instructions: "Istruzioni",
      files: "File ({count:number})",
      webLinks: "Link web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Errore nel recupero dei thread",
      noThreadsFound: "Nessun thread trovato",
    },
    filters: {
      sort: {
        newest: "Più recenti",
        newestFirst: "Più recenti prima",
        oldest: "Più vecchi",
        oldestFirst: "Più vecchi prima",
        label: "Ordina:",
      },
      source: {
        all: "Tutti",
        label: "Origine:",
      },
      temporaryThreads: {
        show: "Mostra",
        hide: "Nascondi",
        label: "Thread temporanei:",
        placeholder: "Thread temporanei",
      },
      type: {
        all: "Tutti",
        label: "Tipo:",
        placeholder: "Tipo",
      },
    },
  },
  common: {
    noResults: "Nessun risultato trovato",
    current: "Corrente",
    expires: "Scade {date}",
  },
} as const satisfies Translations;
