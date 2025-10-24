import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Pokaż podglądy",
    hidePreviews: "Ukryj podglądy",
  },
  input: {
    searchPlaceholder: "Szukaj...",
  },
  actions: {
    createNewThread: "Utwórz nowy wątek",
    toggleIncognitoEnable: "Włącz tryb incognito",
    toggleIncognitoDisable: "Wyłącz tryb incognito",
    toggleLightMode: "Przełącz na tryb jasny",
    toggleDarkMode: "Przełącz na tryb ciemny",
  },
  navigation: {
    home: "Strona główna",
    library: "Biblioteka",
    spaces: "Przestrzenie",
    discover: "Odkrywaj",
    settings: "Ustawienia",
    labs: "Laboratoria",
    current: "Bieżący",
    openInNewTab: "Otwórz w nowej karcie",
    goTo: "Przejdź do {destination}",
  },
  search: {
    threads: "Wątki",
    spaces: "Przestrzenie",
    threadsPlaceholder: "Szukaj wątków...",
    spacesPlaceholder: "Szukaj przestrzeni...",
  },
  groups: {
    actions: "Akcje",
    navigation: "Nawigacja",
    search: "Wyszukiwanie",
  },
  spaces: {
    footer: {
      copyId: "Skopiuj ID",
      copyIdSuccess: "✅ ID skopiowano do schowka",
      openInNewTab: "Otwórz w nowej karcie",
      searchInSpace: "Szukaj w przestrzeni",
      goToSpace: "Przejdź do przestrzeni",
      searchSpacePlaceholder: "Szukaj {spaceName}...",
    },
    commandItems: {
      errorFetching: "Błąd podczas pobierania przestrzeni",
      noSpacesFound: "Nie znaleziono przestrzeni",
    },
    preview: {
      description: "Opis",
      instructions: "Instrukcje",
      files: "Pliki ({count:number})",
      webLinks: "Linki internetowe ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Błąd podczas pobierania wątków",
      noThreadsFound: "Nie znaleziono wątków",
    },
    filters: {
      sort: {
        newest: "Najnowsze",
        newestFirst: "Najnowsze pierwsze",
        oldest: "Najstarsze",
        oldestFirst: "Najstarsze pierwsze",
        label: "Sortuj:",
      },
      source: {
        all: "Wszystkie",
        label: "Źródło:",
      },
      temporaryThreads: {
        show: "Pokaż",
        hide: "Ukryj",
        label: "Tymczasowe wątki:",
        placeholder: "Tymczasowe wątki",
      },
      type: {
        all: "Wszystkie",
        label: "Typ:",
        placeholder: "Typ",
      },
    },
  },
  common: {
    noResults: "Nie znaleziono wyników",
    current: "Bieżący",
  },
} as const satisfies Translations;
