import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "প্রিভিউ দেখান",
    hidePreviews: "প্রিভিউ লুকান",
  },
  input: {
    searchPlaceholder: "অনুসন্ধান...",
  },
  actions: {
    createNewThread: "নতুন থ্রেড তৈরি করুন",
    toggleIncognitoEnable: "ইনকগনিটো মোড সক্রিয় করুন",
    toggleIncognitoDisable: "ইনকগনিটো মোড নিষ্ক্রিয় করুন",
    toggleLightMode: "হালকা মোডে পরিবর্তন করুন",
    toggleDarkMode: "অন্ধকার মোডে পরিবর্তন করুন",
  },
  navigation: {
    home: "হোম",
    library: "লাইব্রেরি",
    spaces: "স্থান",
    discover: "আবিষ্কার",
    settings: "সেটিংস",
    labs: "ল্যাব",
    current: "বর্তমান",
    openInNewTab: "নতুন ট্যাবে খুলুন",
    goTo: "{destination} এ যান",
  },
  search: {
    threads: "থ্রেড",
    spaces: "স্থান",
    threadsPlaceholder: "থ্রেড অনুসন্ধান...",
    spacesPlaceholder: "স্থান অনুসন্ধান...",
  },
  groups: {
    actions: "কর্ম",
    navigation: "নেভিগেশন",
    search: "অনুসন্ধান",
  },
  spaces: {
    footer: {
      copyId: "ID অনুলিপি করুন",
      copyIdSuccess: "✅ ID ক্লিপবোর্ডে অনুলিপি করা হয়েছে",
      openInNewTab: "নতুন ট্যাবে খুলুন",
      searchInSpace: "স্থানে অনুসন্ধান করুন",
      goToSpace: "স্থানে যান",
      searchSpacePlaceholder: "{spaceName} অনুসন্ধান...",
    },
    commandItems: {
      errorFetching: "স্থান আনতে ত্রুটি",
      noSpacesFound: "কোন স্থান পাওয়া যায়নি",
    },
    preview: {
      description: "বিবরণ",
      instructions: "নির্দেশাবলী",
      files: "ফাইল ({count:number})",
      webLinks: "ওয়েব লিঙ্ক ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "থ্রেড আনতে ত্রুটি",
      noThreadsFound: "কোন থ্রেড পাওয়া যায়নি",
    },
    filters: {
      sort: {
        newest: "সর্বশেষ",
        newestFirst: "সর্বশেষ প্রথম",
        oldest: "সবচেয়ে পুরানো",
        oldestFirst: "সবচেয়ে পুরানো প্রথম",
        label: "সাজান:",
      },
      source: {
        all: "সব",
        label: "উৎস:",
      },
      temporaryThreads: {
        show: "দেখান",
        hide: "লুকান",
        label: "অস্থায়ী থ্রেড:",
        placeholder: "অস্থায়ী থ্রেড",
      },
      type: {
        all: "সব",
        label: "ধরন:",
        placeholder: "ধরন",
      },
    },
  },
  common: {
    noResults: "কোন ফলাফল পাওয়া যায়নি",
    current: "বর্তমান",
  },
} as const satisfies Translations;
