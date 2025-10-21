import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "परियोजना को जीवित रखने के लिए दान करें!",
  },
  sponsorDialog: {
    title: "Complexity को शानदार बनाए रखने में मदद करें!",
    description:
      "आपके लिए Complexity को एक शक्तिशाली और परिष्कृत उपकरण बनाने में अनगिनत घंटे लगाए गए हैं। आपका समर्थन सीधे ongoing विकास, नई सुविधाओं और सब कुछ सुचारू रूप से चलाने में मदद करता है।",
    descriptionLine2:
      "यदि Complexity आपके workflow में मूल्य जोड़ता है, तो कृपया इसके भविष्य में योगदान देने पर विचार करें!",
    cometAffiliate: {
      title: "मुफ्त <0/>!",
      description:
        "Comet आजमाएं - Perplexity का नया ब्राउज़र - और एक मुफ्त <0/> सदस्यता प्राप्त करें और इस बीच Complexity के विकास में सीधे योगदान करें।",
      claimButton: "अभी दावा करें",
      dismissButton: "खारिज करें",
    },
    donation: {
      title: "💖 भविष्य के विकास का समर्थन करें",
    },
    sponsorship: {
      title: "🌟 प्रायोजन में रुचि है?",
      contactEmail: "ईमेल के माध्यम से संपर्क करें",
    },
  },
  misc: {
    words: "शब्द",
    characters: "अक्षर",
    rewrite: "पुनर्लेखन करें",
    speakAloud: "जोर से पढ़ें",
    stop: "रोकें",
  },
  releaseNotes: {
    title: "v{version} में अपडेट किया गया",
    dontShowAgain: "खारिज करें और भविष्य के अपडेट के लिए फिर से न दिखाएं",
    confirmDialog: {
      title: "पुष्टि करें",
      message:
        "क्या आप वाकई खारिज करना चाहते हैं और भविष्य के अपडेट के लिए फिर से नहीं दिखाना चाहते? आप हमेशा सेटिंग्स पेज में इस पॉपअप को फिर से सक्षम कर सकते हैं।",
      cancel: "रद्द करें",
      confirm: "मैं समझता हूँ",
    },
    dismiss: "खारिज करें",
  },
} as const satisfies Translations;
