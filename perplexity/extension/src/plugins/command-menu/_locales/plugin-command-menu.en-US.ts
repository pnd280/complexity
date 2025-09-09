import type { LanguageMessages } from "@complexity/i18n";

export default {
  sidecar: {
    showPreviews: "Show Previews",
    hidePreviews: "Hide Previews",
  },
  input: {
    searchPlaceholder: "Search...",
  },
  actions: {
    createNewThread: "Create New Thread",
    toggleIncognitoEnable: "Enable Incognito Mode",
    toggleIncognitoDisable: "Disable Incognito Mode",
    toggleLightMode: "Change to Light Mode",
    toggleDarkMode: "Change to Dark Mode",
  },
  navigation: {
    home: "Home",
    library: "Library",
    spaces: "Spaces",
    discover: "Discover",
    settings: "Settings",
    labs: "Labs",
    current: "Current",
    openInNewTab: "Open in new tab",
    goTo: "Go to {destination}",
  },
  search: {
    threads: "Threads",
    spaces: "Spaces",
    threadsPlaceholder: "Search Threads...",
    spacesPlaceholder: "Search Spaces...",
  },
  groups: {
    actions: "Actions",
    navigation: "Navigation",
    search: "Search",
  },
  spaces: {
    footer: {
      openInNewTab: "Open in new tab",
      searchInSpace: "Search in Space",
      goToSpace: "Go to Space",
      searchSpacePlaceholder: "Search {spaceName}...",
    },
    commandItems: {
      errorFetching: "Error fetching Spaces",
      noSpacesFound: "No Spaces found",
    },
    preview: {
      description: "Description",
      instructions: "Instructions",
      files: "Files ({count:number})",
      webLinks: "Web Links ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Error fetching Threads",
      noThreadsFound: "No Threads found",
    },
    filters: {
      sort: {
        newest: "Newest",
        newestFirst: "Newest First",
        oldest: "Oldest",
        oldestFirst: "Oldest First",
        label: "Sort:",
      },
      source: {
        all: "All",
        label: "Source:",
      },
      temporaryThreads: {
        show: "Show",
        hide: "Hide",
        label: "Temp Threads:",
        placeholder: "Temporary Threads",
      },
      type: {
        all: "All",
        label: "Type:",
        placeholder: "Type",
      },
    },
  },
  common: {
    noResults: "No results found",
    current: "Current",
  },
} as const satisfies LanguageMessages;
