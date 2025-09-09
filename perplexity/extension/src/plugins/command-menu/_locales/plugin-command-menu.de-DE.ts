import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Vorschauen anzeigen",
    hidePreviews: "Vorschauen ausblenden",
  },
  input: {
    searchPlaceholder: "Suchen...",
  },
  actions: {
    createNewThread: "Neuen Thread erstellen",
    toggleIncognitoEnable: "Inkognito-Modus aktivieren",
    toggleIncognitoDisable: "Inkognito-Modus deaktivieren",
    toggleLightMode: "Zu hellem Modus wechseln",
    toggleDarkMode: "Zu dunklem Modus wechseln",
  },
  navigation: {
    home: "Startseite",
    library: "Bibliothek",
    spaces: "Bereiche",
    discover: "Entdecken",
    settings: "Einstellungen",
    labs: "Labs",
    current: "Aktuell",
    openInNewTab: "In neuem Tab öffnen",
    goTo: "Gehe zu {destination}",
  },
  search: {
    threads: "Threads",
    spaces: "Bereiche",
    threadsPlaceholder: "Threads suchen...",
    spacesPlaceholder: "Bereiche suchen...",
  },
  groups: {
    actions: "Aktionen",
    navigation: "Navigation",
    search: "Suche",
  },
  spaces: {
    footer: {
      openInNewTab: "In neuem Tab öffnen",
      searchInSpace: "Im Bereich suchen",
      goToSpace: "Zum Bereich gehen",
      searchSpacePlaceholder: "{spaceName} durchsuchen...",
    },
    commandItems: {
      errorFetching: "Fehler beim Abrufen der Bereiche",
      noSpacesFound: "Keine Bereiche gefunden",
    },
    preview: {
      description: "Beschreibung",
      instructions: "Anweisungen",
      files: "Dateien ({count:number})",
      webLinks: "Web-Links ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Fehler beim Abrufen der Threads",
      noThreadsFound: "Keine Threads gefunden",
    },
    filters: {
      sort: {
        newest: "Neueste",
        newestFirst: "Neueste zuerst",
        oldest: "Älteste",
        oldestFirst: "Älteste zuerst",
        label: "Sortieren:",
      },
      source: {
        all: "Alle",
        label: "Quelle:",
      },
      temporaryThreads: {
        show: "Anzeigen",
        hide: "Ausblenden",
        label: "Temporäre Threads:",
        placeholder: "Temporäre Threads",
      },
      type: {
        all: "Alle",
        label: "Typ:",
        placeholder: "Typ",
      },
    },
  },
  common: {
    noResults: "Keine Ergebnisse gefunden",
    current: "Aktuell",
  },
} as const satisfies Translations;
