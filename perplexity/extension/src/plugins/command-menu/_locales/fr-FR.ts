import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Afficher les aperçus",
    hidePreviews: "Masquer les aperçus",
  },
  input: {
    searchPlaceholder: "Rechercher...",
  },
  actions: {
    createNewThread: "Créer un nouveau fil",
    toggleIncognitoEnable: "Activer le mode incognito",
    toggleIncognitoDisable: "Désactiver le mode incognito",
    toggleLightMode: "Passer en mode clair",
    toggleDarkMode: "Passer en mode sombre",
  },
  navigation: {
    home: "Accueil",
    library: "Bibliothèque",
    spaces: "Espaces",
    discover: "Découvrir",
    settings: "Paramètres",
    labs: "Laboratoires",
    current: "Actuel",
    openInNewTab: "Ouvrir dans un nouvel onglet",
    goTo: "Aller à {destination}",
  },
  search: {
    threads: "Fils",
    spaces: "Espaces",
    threadsPlaceholder: "Rechercher des fils...",
    spacesPlaceholder: "Rechercher des espaces...",
  },
  groups: {
    actions: "Actions",
    navigation: "Navigation",
    search: "Recherche",
  },
  spaces: {
    footer: {
      copyId: "Copier l'ID",
      copyIdSuccess: "✅ ID copié dans le presse-papiers",
      openInNewTab: "Ouvrir dans un nouvel onglet",
      searchInSpace: "Rechercher dans l'espace",
      goToSpace: "Aller à l'espace",
      searchSpacePlaceholder: "Rechercher {spaceName}...",
    },
    commandItems: {
      errorFetching: "Erreur lors de la récupération des espaces",
      noSpacesFound: "Aucun espace trouvé",
    },
    preview: {
      description: "Description",
      instructions: "Instructions",
      files: "Fichiers ({count:number})",
      webLinks: "Liens web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Erreur lors de la récupération des fils",
      noThreadsFound: "Aucun fil trouvé",
    },
    filters: {
      sort: {
        newest: "Plus récents",
        newestFirst: "Plus récents en premier",
        oldest: "Plus anciens",
        oldestFirst: "Plus anciens en premier",
        label: "Trier :",
      },
      source: {
        all: "Tous",
        label: "Source :",
      },
      temporaryThreads: {
        show: "Afficher",
        hide: "Masquer",
        label: "Fils temporaires :",
        placeholder: "Fils temporaires",
      },
      type: {
        all: "Tous",
        label: "Type :",
        placeholder: "Type",
      },
    },
  },
  common: {
    noResults: "Aucun résultat trouvé",
    current: "Actuel",
    expires: "Expiration {date}",
  },
} as const satisfies Translations;
