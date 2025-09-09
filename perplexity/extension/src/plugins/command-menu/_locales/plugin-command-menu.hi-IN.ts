import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "पूर्वावलोकन दिखाएं",
    hidePreviews: "पूर्वावलोकन छुपाएं",
  },
  input: {
    searchPlaceholder: "खोजें...",
  },
  actions: {
    createNewThread: "नया धागा बनाएं",
    toggleIncognitoEnable: "गुप्त मोड सक्षम करें",
    toggleIncognitoDisable: "गुप्त मोड अक्षम करें",
    toggleLightMode: "हल्के मोड में बदलें",
    toggleDarkMode: "डार्क मोड में बदलें",
  },
  navigation: {
    home: "होम",
    library: "पुस्तकालय",
    spaces: "स्थान",
    discover: "खोजें",
    settings: "सेटिंग्स",
    labs: "प्रयोगशालाएं",
    current: "वर्तमान",
    openInNewTab: "नए टैब में खोलें",
    goTo: "{destination} पर जाएं",
  },
  search: {
    threads: "धागे",
    spaces: "स्थान",
    threadsPlaceholder: "धागे खोजें...",
    spacesPlaceholder: "स्थान खोजें...",
  },
  groups: {
    actions: "क्रियाएं",
    navigation: "नेवीगेशन",
    search: "खोज",
  },
  spaces: {
    footer: {
      openInNewTab: "नए टैब में खोलें",
      searchInSpace: "स्थान में खोजें",
      goToSpace: "स्थान पर जाएं",
      searchSpacePlaceholder: "{spaceName} खोजें...",
    },
    commandItems: {
      errorFetching: "स्थान प्राप्त करने में त्रुटि",
      noSpacesFound: "कोई स्थान नहीं मिला",
    },
    preview: {
      description: "विवरण",
      instructions: "निर्देश",
      files: "फाइलें ({count:number})",
      webLinks: "वेब लिंक ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "धागे प्राप्त करने में त्रुटि",
      noThreadsFound: "कोई धागा नहीं मिला",
    },
    filters: {
      sort: {
        newest: "नवीनतम",
        newestFirst: "नवीनतम पहले",
        oldest: "सबसे पुराना",
        oldestFirst: "सबसे पुराना पहले",
        label: "क्रमबद्ध करें:",
      },
      source: {
        all: "सभी",
        label: "स्रोत:",
      },
      temporaryThreads: {
        show: "दिखाएं",
        hide: "छुपाएं",
        label: "अस्थायी धागे:",
        placeholder: "अस्थायी धागे",
      },
      type: {
        all: "सभी",
        label: "प्रकार:",
        placeholder: "प्रकार",
      },
    },
  },
  common: {
    noResults: "कोई परिणाम नहीं मिला",
    current: "वर्तमान",
  },
} as const satisfies Translations;
