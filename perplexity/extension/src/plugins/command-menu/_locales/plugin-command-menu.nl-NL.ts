import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Voorbeelden tonen",
    hidePreviews: "Voorbeelden verbergen",
  },
  input: {
    searchPlaceholder: "Zoeken...",
  },
  actions: {
    createNewThread: "Nieuwe draad maken",
    toggleIncognitoEnable: "Incognito-modus inschakelen",
    toggleIncognitoDisable: "Incognito-modus uitschakelen",
    toggleLightMode: "Overschakelen naar lichte modus",
    toggleDarkMode: "Overschakelen naar donkere modus",
  },
  navigation: {
    home: "Startpagina",
    library: "Bibliotheek",
    spaces: "Ruimtes",
    discover: "Ontdekken",
    settings: "Instellingen",
    labs: "Laboratoria",
    current: "Huidige",
    openInNewTab: "Openen in nieuw tabblad",
    goTo: "Ga naar {destination}",
  },
  search: {
    threads: "Draden",
    spaces: "Ruimtes",
    threadsPlaceholder: "Draden zoeken...",
    spacesPlaceholder: "Ruimtes zoeken...",
  },
  groups: {
    actions: "Acties",
    navigation: "Navigatie",
    search: "Zoeken",
  },
  spaces: {
    footer: {
      copyId: "ID kopiëren",
      copyIdSuccess: "✅ ID gekopieerd naar klembord",
      openInNewTab: "Openen in nieuw tabblad",
      searchInSpace: "Zoeken in ruimte",
      goToSpace: "Ga naar ruimte",
      searchSpacePlaceholder: "Zoek {spaceName}...",
    },
    commandItems: {
      errorFetching: "Fout bij ophalen van ruimtes",
      noSpacesFound: "Geen ruimtes gevonden",
    },
    preview: {
      description: "Beschrijving",
      instructions: "Instructies",
      files: "Bestanden ({count:number})",
      webLinks: "Weblinks ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Fout bij ophalen van draden",
      noThreadsFound: "Geen draden gevonden",
    },
    filters: {
      sort: {
        newest: "Nieuwste",
        newestFirst: "Nieuwste eerst",
        oldest: "Oudste",
        oldestFirst: "Oudste eerst",
        label: "Sorteren:",
      },
      source: {
        all: "Alle",
        label: "Bron:",
      },
      temporaryThreads: {
        show: "Tonen",
        hide: "Verbergen",
        label: "Tijdelijke draden:",
        placeholder: "Tijdelijke draden",
      },
      type: {
        all: "Alle",
        label: "Type:",
        placeholder: "Type",
      },
    },
  },
  common: {
    noResults: "Geen resultaten gevonden",
    current: "Huidige",
    expires: "Verloopt {date}",
  },
} as const satisfies Translations;
