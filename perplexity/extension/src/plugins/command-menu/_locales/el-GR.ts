import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Εμφάνιση Προεπισκοπήσεων",
    hidePreviews: "Απόκρυψη Προεπισκοπήσεων",
  },
  input: {
    searchPlaceholder: "Αναζήτηση...",
  },
  actions: {
    createNewThread: "Δημιουργία Νέου Νήματος",
    toggleIncognitoEnable: "Ενεργοποίηση Λειτουργίας Ανώνυμου",
    toggleIncognitoDisable: "Απενεργοποίηση Λειτουργίας Ανώνυμου",
    toggleLightMode: "Αλλαγή σε Φωτεινή Λειτουργία",
    toggleDarkMode: "Αλλαγή σε Σκοτεινή Λειτουργία",
  },
  navigation: {
    home: "Αρχική",
    library: "Βιβλιοθήκη",
    spaces: "Χώροι",
    discover: "Ανακάλυψη",
    settings: "Ρυθμίσεις",
    labs: "Εργαστήρια",
    current: "Τρέχον",
    openInNewTab: "Άνοιγμα σε νέα καρτέλα",
    goTo: "Μετάβαση στο {destination}",
  },
  search: {
    threads: "Νήματα",
    spaces: "Χώροι",
    threadsPlaceholder: "Αναζήτηση Νημάτων...",
    spacesPlaceholder: "Αναζήτηση Χώρων...",
  },
  groups: {
    actions: "Ενέργειες",
    navigation: "Πλοήγηση",
    search: "Αναζήτηση",
  },
  spaces: {
    footer: {
      copyId: "Αντιγραφή ID",
      copyIdSuccess: "✅ ID αντιγράφηκε στο πρόχειρο",
      openInNewTab: "Άνοιγμα σε νέα καρτέλα",
      searchInSpace: "Αναζήτηση στον Χώρο",
      goToSpace: "Μετάβαση στον Χώρο",
      searchSpacePlaceholder: "Αναζήτηση {spaceName}...",
    },
    commandItems: {
      errorFetching: "Σφάλμα λήψης Χώρων",
      noSpacesFound: "Δεν βρέθηκαν Χώροι",
    },
    preview: {
      description: "Περιγραφή",
      instructions: "Οδηγίες",
      files: "Αρχεία ({count:number})",
      webLinks: "Σύνδεσμοι Ιστού ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Σφάλμα λήψης Νημάτων",
      noThreadsFound: "Δεν βρέθηκαν Νήματα",
    },
    filters: {
      sort: {
        newest: "Νεότερα",
        newestFirst: "Νεότερα Πρώτα",
        oldest: "Παλαιότερα",
        oldestFirst: "Παλαιότερα Πρώτα",
        label: "Ταξινόμηση:",
      },
      source: {
        all: "Όλα",
        label: "Πηγή:",
      },
      temporaryThreads: {
        show: "Εμφάνιση",
        hide: "Απόκρυψη",
        label: "Προσωρινά Νήματα:",
        placeholder: "Προσωρινά Νήματα",
      },
      type: {
        all: "Όλα",
        label: "Τύπος:",
        placeholder: "Τύπος",
      },
    },
  },
  common: {
    noResults: "Δεν βρέθηκαν αποτελέσματα",
    current: "Τρέχον",
    expires: "Λήγει {date}",
  },
} as const satisfies Translations;
