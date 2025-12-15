import type { Translations } from "@/entrypoints/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Κάντε μια δωρεά για να διατηρήσετε το έργο ζωντανό!",
  },
  sponsorDialog: {
    title: "Το Complexity Χρειάζεται τη Βοήθειά σας!",
    description:
      "Αμέτρητες ώρες έχουν αφιερωθεί για να γίνει το Complexity ένα ισχυρό και προσεγμένο εργαλείο για εσάς. Η υποστήριξή σας τροφοδοτεί άμεσα τη συνεχή ανάπτυξη, νέες λειτουργίες και διατηρεί τα πάντα να λειτουργούν ομαλά.",
    descriptionLine2:
      "Αν το Complexity προσθέτει αξία στη ροή εργασίας σας, παρακαλώ σκεφτείτε να συνεισφέρετε στο μέλλον του!",
    cometAffiliate: {
      title: "Δοκιμάστε το Comet - Λάβετε δωρεάν <0/> abonnement!",
      description:
        "Δοκιμάστε το Comet - ένα νέο πρόγραμμα περιήγησης από το Perplexity - και λάβετε ένα δωρεάν <0/> abonnement ενώ συγχρόνως συνεισφέρετε άμεσα στην ανάπτυξη του Complexity.",
      claimButton: "Διεκδικήστε το τώρα",
      dismissButton: "Απόρριψη",
    },
    donation: {
      title: "💖 Κάντε μια δωρεά",
    },
    sponsorship: {
      title: "🌟 Έχετε μια προσφορά για μακροχρόνια χορηγία;",
      contactEmail: "Επικοινωνία μέσω Email",
    },
  },
  misc: {
    words: "λέξεις",
    characters: "χαρακτήρες",
    rewrite: "Επανεγγραφή",
    speakAloud: "Εκφώνηση",
    stop: "Διακοπή",
  },
  releaseNotes: {
    title: "Ενημερώθηκε στην έκδοση v{version}",
    dontShowAgain:
      "Απόρριψη και να μην εμφανιστεί ξανά για μελλοντικές ενημερώσεις",
    confirmDialog: {
      title: "Επιβεβαίωση",
      message:
        "Είστε βέβαιοι ότι θέλετε να απορρίψετε και να μην εμφανίζετε ξανά για μελλοντικές ενημερώσεις; Μπορείτε πάντα να επανενεργοποιήσετε αυτό το αναδυόμενο παράθυρο στη σελίδα ρυθμίσεων.",
      cancel: "Ακύρωση",
      confirm: "Καταλαβαίνω",
    },
    dismiss: "Απόρριψη",
  },
} as const satisfies Translations;
