import type { Translations } from "@/entrypoints/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Faceți o donație pentru a menține proiectul în viață!",
  },
  sponsorDialog: {
    title: "Ajutați la menținerea Complexity grozav!",
    description:
      "Nenumărate ore au fost investite pentru a face Complexity un instrument puternic și bine finisat pentru dvs. Sprijinul dvs. alimentează direct dezvoltarea continuă, noi funcții și menținerea tuturor în stare de funcționare.",
    descriptionLine2:
      "Dacă Complexity adaugă valoare fluxului dvs. de lucru, vă rugăm să luați în considerare contribuția la viitorul său!",
    cometAffiliate: {
      title: "Încercați Comet - Obțineți un abonament gratuit <0/>!",
      description:
        "Încercați Comet - noul browser de la Perplexity - și obțineți un abonament gratuit <0/> și în același timp contribuiți direct la dezvoltarea Complexity.",
      claimButton: "Revendicați acum",
      dismissButton: "Respingeți",
    },
    donation: {
      title: "💖 Susțineți dezvoltarea viitoare",
    },
    sponsorship: {
      title: "🌟 Interesat de sponsorizare?",
      contactEmail: "Contactați prin Email",
    },
  },
  misc: {
    words: "cuvinte",
    characters: "caractere",
    rewrite: "Rescrie",
    speakAloud: "Citește cu voce tare",
    stop: "Oprește",
  },
  releaseNotes: {
    title: "Actualizat la v{version}",
    dontShowAgain: "Respingeți și nu mai afișați pentru actualizări viitoare",
    confirmDialog: {
      title: "Confirmare",
      message:
        "Sunteți sigur că doriți să respingeți și să nu mai afișați pentru actualizări viitoare? Puteți reactiva oricând această fereastră pop-up din pagina de setări.",
      cancel: "Anulați",
      confirm: "Am înțeles",
    },
    dismiss: "Respingeți",
  },
} as const satisfies Translations;
