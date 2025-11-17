import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("{name:enum} देखने के लिए क्लिक करें", {
      enum: {
        name: {
          markdown: "सामग्री",
          mermaid: "आरेख",
          plantuml: "आरेख",
          html: "वेब पेज",
          react: "वेब पेज",
          markmap: "माइंडमैप",
        },
      },
    }),
  },
  version: "संस्करण {number:number}",
  toggle: {
    preview: "पूर्वावलोकन",
    markdown: "कच्चा टेक्स्ट",
    code: "कोड",
  },
  list: {
    title: "इस थ्रेड में आर्टिफैक्ट्स",
    generating: "जनरेट हो रहा है...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 संस्करण",
          other: "{?} संस्करण",
        },
      },
    }),
  },
  tooltip: {
    refresh: "रिफ्रेश करें",
    openList: "आर्टिफैक्ट्स सूची खोलें",
    openInCodeSandbox: "CodeSandbox में खोलें",
    openInMermaid: "Mermaid Live Editor में खोलें",
    downloadSvg: "SVG डाउनलोड करें",
    downloadAsInteractiveHtml: "इंटरैक्टिव HTML के रूप में डाउनलोड करें",
    viewAsInteractiveHtml: "इंटरैक्टिव HTML के रूप में देखें",
  },
  error: {
    noSvg: "कोई SVG नहीं मिला",
    previewUrl: "पूर्वावलोकन URL जनरेट करने में विफल",
  },
} as const satisfies Translations;
