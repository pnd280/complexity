/**
 * Mixes of both native css and jquery selectors, so always use jQuery instead of document.querySelector
 */

import type { DomSelectors } from "@/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";

export const DOM_SELECTORS: DomSelectors = {
  ROOT: "#root",
  PAGE_WRAPPER:
    "#root > .border-subtlest.ring-subtlest.divide-subtlest.bg-underlay",
  SIDEBAR: {
    WRAPPER: ".group\\/sidebar",
    CHILD: {
      MENU: ".group\\/sidebar-menu",
    },
    MOBILE_TRIGGER: `.h-headerHeight.backdrop-blur-md button:has(svg>path[d="M4 6l16 0 M4 12l16 0 M4 18l16 0"])`,
    PIN_SIDEBAR_BUTTON: 'button[data-testid="sidebar-pin-sidebar"]',
  },
  THREAD: {
    /** The outermost container that wraps the thread container and the query box */
    NAVBAR: ".h-headerHeight.backdrop-blur-md",
    WRAPPER: ".h-headerHeight.backdrop-blur-md + div",
    /** The container that wraps all messages */
    MESSAGE_BLOCKS_WRAPPER: {
      DESKTOP: {
        NORMAL: `.h-headerHeight.backdrop-blur-md + div > div:first-child > div:last-child`,
        BRANCHED: `.h-headerHeight.backdrop-blur-md + div > div:first-child > div:last-child`,
      },
      MOBILE: {
        NORMAL: `.h-headerHeight.backdrop-blur-md + div > div:first-child > div:last-child`,
        BRANCHED: `.h-headerHeight.backdrop-blur-md + div > div:first-child > div:last-child`,
      },
    },
    MESSAGE: {
      QUERY_WRAPPER: ".isolate.mx-auto > .bg-base",
      QUERY: ".group\\/query",
      QUERY_EDIT_BUTTON_GROUP:
        ".absolute.bottom-0.right-0:not(.pointer-events-none)",
      QUERY_EDIT_BUTTON_GROUP_CHILD: {
        EDIT_QUERY_BUTTON: 'button[data-testid="edit-query-button"]',
      },
      STICKY_HEADER: ".h-headerHeight.backdrop-blur-md",
      SOURCES: ".gap-sm.grid.grid-cols-4.md\\:px-0",
      CONTENT_WRAPPER:
        ".isolate.mx-auto > .bg-base ~ .max-w-threadContentWidth",
      ANSWER: "div[id*='markdown-content-']",
      ANSWER_TEXT_CONTENT: ".prose.text-pretty",
      /** The footer of the message (share, rewrite, model name, etc.) */
      FOOTER:
        ".gap-y-sm.md\\:gap-y-md.flex.flex-col > .flex.items-center.justify-between",
      FOOTER_CHILD: {
        DISPLAY_MODEL_BUTTON:
          'button:has(svg>path[d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z M9 9h6v6h-6z M3 10h2 M3 14h2 M10 3v2 M14 3v2 M21 10h-2 M21 14h-2 M14 21v-2 M10 21v-2"])',
        REWRITE_BUTTON:
          'button:has(svg>path[d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3 M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"])',
        REWRITE_BUTTON_WRAPPER:
          'div:has(>span>button svg>path[d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3 M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3"])',
        COPY_BUTTON:
          'button:has(>div>div>svg>path[d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"])',
        THUMBS_DOWN_BUTTON:
          'button:has(>div>div>svg>path[d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"])',
        MISC_BUTTON_WRAPPER:
          'div:has(>span>button>div>div>svg>path[d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"])',
      },
      IMAGE_GEN: {
        HEADER: "div:has(+.gap-sm.grid.grid-cols-2)",
        OPTIONS_GRID: ".gap-sm.grid.grid-cols-2",
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: "div.w-full.md\\:max-w-\\[90vw\\]:has(>pre)",
        NATIVE_HEADER: ".codeWrapper>div:first-child",
        NATIVE_COPY_BUTTON: 'button[data-testid="copy-code-button"]',
        LANGUAGE_INDICATOR: "[data-testid='code-language-indicator']",
      },
    },
    POPPER: {
      DESKTOP: "div[data-type='portal'] .absolute.inset-x-0.top-0",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.md\\:absolute.text-center",
    FOOTER: ".hidden.pb-md.md\\:block>div",
    COMET_HOME_MAIN_WRAPPER:
      ".grid.grid-cols-\\[repeat\\(auto-fill\\,minmax\\(160px\\,1fr\\)\\)\\].gap-3",
  },
  QUERY_BOX: {
    WRAPPER: {
      MAIN: 'body[location="home"] .grow.block',
      SPACE: 'body[location="collection"] .grow.block',
      FOLLOW_UP: 'body[location="thread"] .grow.block',
      COMET_ASSISTANT: 'body[location="comet_assistant"] .grow.block',
      ARBITRARY: ".grow.block",
    },
    ATTR_WRAPPER: "> div > div:not([data-type]) > div",
    ATTR_WRAPPER_CHILD: {
      COMET_ASSISTANT: "> div > div:not([data-type]) > div > div:last-child",
      LEFT_ATTR_WRAPPER: ">div:nth-child(2)",
      RIGHT_ATTR_WRAPPER: ">div:nth-child(3)",
    },
    TEXTBOX: {
      MAIN: "#ask-input",
      SPACE: "#ask-input",
      FOLLOW_UP: "#ask-input",
      COMET_ASSISTANT: "#ask-input",
      EDIT_QUERY: "div[contenteditable='true'][role='textbox']:not([id])",
      ARBITRARY: "#ask-input,div[contenteditable='true'][role='textbox']",
    },
    ATTACH_BUTTON:
      'button:has(svg>path[d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"])',
    SUBMIT_BUTTON:
      'button[data-testid="submit-button"], button:has(>div>div>svg>path[d="M0 12.6663C0 13.4018 0.59792 13.9997 1.33333 13.9997C2.06875 13.9997 2.66667 13.4018 2.66667 12.6663V11.333C2.66667 10.5975 2.06875 9.99967 1.33333 9.99967C0.59792 9.99967 0 10.5975 0 11.333V12.6663ZM6.66667 5.33301C7.40213 5.33301 8 5.93087 8 6.66634V17.333C8 18.0685 7.40213 18.6663 6.66667 18.6663C5.9312 18.6663 5.33333 18.0685 5.33333 17.333V6.66634C5.33333 5.93087 5.9312 5.33301 6.66667 5.33301ZM10.6667 21.333C10.6667 22.0685 11.2645 22.6663 12 22.6663C12.7355 22.6663 13.3333 22.0685 13.3333 21.333V2.66634C13.3333 1.93093 12.7355 1.33301 12 1.33301C11.2645 1.33301 10.6667 1.93093 10.6667 2.66634V21.333ZM17.3333 5.33301C18.0688 5.33301 18.6667 5.93087 18.6667 6.66634V17.333C18.6667 18.0685 18.0688 18.6663 17.3333 18.6663C16.5979 18.6663 16 18.0685 16 17.333V6.66634C16 5.93087 16.5979 5.33301 17.3333 5.33301ZM24 11.333C24 10.5975 23.4021 9.99967 22.6667 9.99967C21.9312 9.99967 21.3333 10.5975 21.3333 11.333V12.6663C21.3333 13.4018 21.9312 13.9997 22.6667 13.9997C23.4021 13.9997 24 13.4018 24 12.6663V11.333Z"]), button:has(>div>div>svg>path[d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z"])',
    FORK_BUTTON:
      'button:has(svg>path[d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M7 8v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-2 M12 12l0 4"])',
    PRO_SEARCH_TOGGLE: "button#copilot-toggle",
    INCOGNITO_TOGGLE: ".mr-xs.flex.shrink-0.items-center",
    TYPEAHEAD_MENU: "#typeahead-menu",
    CONTENT_EDITABLE: {
      TEXTCONTENT_NODE: '[data-lexical-text="true"]',
    },
    SEARCH_TYPE_RADIO: {
      ITEM: `div:not([data-cplx-component]) > div[role=radiogroup] > div > span > button`,
      CHECKED_ITEM: `div:not([data-cplx-component]) > div[role=radiogroup] > div > span > button[data-state=checked]`,
    },
  },
  SETTINGS_PAGE: {
    SIDEBAR_WRAPPER: ".w-sideBarWidth:has(+.scrollable-container)",
    SIDEBAR_CHILD: {
      BACK_BUTTON: ".mb-3.ml-2.flex.md\\:px-2",
    },
  },
  STICKY_NAVBAR: ".h-headerHeight.backdrop-blur-md",
  SICKY_NAVBAR_CHILD: {
    THREAD_TITLE_WRAPPER:
      ".hidden.max-w-md.grow.items-center.justify-center.gap-x-xs.text-center.md\\:flex",
    THREAD_TITLE:
      ".min-w-0 .cursor-pointer.transition.duration-300.hover\\:opacity-70",
    THREAD_TITLE_INPUT: 'input[placeholder="Untitled"]',
    OVERFLOW_MENU_BUTTON_WRAPPER: `div:has(>span>button>div>div>svg>path[d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"])`,
  },
} as const;

/**
 * Selectors that are generated by the extension.
 */
export const INTERNAL_ATTRIBUTES = {
  PAGE_WRAPPER: "page-wrapper",
  SIDEBAR: {
    WRAPPER: "sidebar-wrapper",
    MOBILE_TRIGGER: "sidebar-mobile-trigger",
    CHILD: {
      MENU: "sidebar-menu",
    },
  },
  HOME: {
    SLOGAN: "home-slogan",
    FOOTER: "home-footer",
    LANGUAGE_SELECTOR: "home-language-selector",
  },
  THREAD: {
    NAVBAR: "thread-navbar",
    NAVBAR_CHILD: {
      EXPORT_THREAD_BUTTON: "thread-export-button",
      OVERFLOW_MENU_BUTTON_WRAPPER: "thread-overflow-menu-button-wrapper",
    },
    WRAPPER: "thread-wrapper",
    MESSAGE_BLOCKS_WRAPPER: "thread-message-blocks-wrapper",
    TOC_CONTAINER: "thread-toc-container",
    MESSAGE: {
      BLOCK: "message-block",
      QUERY: "message-block-query",
      QUERY_EDIT_BUTTON_GROUP: "message-block-query-edit-button-group",
      ANSWER: "message-block-answer",
      CODE_BLOCK: "message-block-code-block",
      MIRRORED_CODE_BLOCK: "mirrored-code-block",
      FOOTER: "message-block-footer",
    },
    ATTACHMENT_DROP_ZONE: "drag-n-drop-file-to-upload",
  },
  QUERY_BOX: {
    MAIN_QUERY_BOX: "cplx-main-query-box",
    SPACE_QUERY_BOX: "cplx-space-query-box",
    FOLLOW_UP_QUERY_BOX: "cplx-follow-up-query-box",
    COMET_ASSISTANT_QUERY_BOX: "cplx-comet-assistant-query-box",
  },
  QUERY_BOX_CHILD: {
    COMPONENTS_WRAPPER: "query-box-components-wrapper",
    PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER:
      "query-box-pplx-left-toolbar-components-wrapper",
    CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER:
      "query-box-cplx-left-toolbar-components-left-wrapper",
    CPLX_LEFT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER:
      "query-box-cplx-left-toolbar-components-right-wrapper",
    PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER:
      "query-box-pplx-right-toolbar-components-wrapper",
    CPLX_RIGHT_TOOLBAR_COMPONENTS_LEFT_WRAPPER:
      "query-box-cplx-right-toolbar-components-left-wrapper",
    CPLX_RIGHT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER:
      "query-box-cplx-right-toolbar-components-right-wrapper",
    COMET_ASSISTANT: "query-box-comet-assistant-toolbar-wrapper",
  },
  SPACES_PAGE: {
    SPACE_CARD: "space-card",
  },
  SETTINGS_PAGE: {
    SIDEBAR_WRAPPER: "settings-page-sidebar-wrapper",
    CPLX_DASHBOARD_LINK: "settings-page-cplx-dashboard-link",
  },
} as const;

export const TEST_ID = {
  QUERY_BOX: {
    FOCUS_SELECTOR: "cplx-focus-selector",
    LANGUAGE_MODEL_SELECTOR: "cplx-language-model-selector",
    IMAGE_GEN_MODEL_SELECTOR: "cplx-image-gen-model-selector",
    SPACE_NAVIGATOR: "cplx-space-navigator",
  },
} as const;
