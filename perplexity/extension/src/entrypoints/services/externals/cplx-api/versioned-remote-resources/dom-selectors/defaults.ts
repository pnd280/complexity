import type { DomSelectors } from "@/entrypoints/services/externals/cplx-api/versioned-remote-resources/dom-selectors/types";

/**
 * Mixes of both native css and jquery selectors, so always use jQuery instead of document.querySelector
 */
export const DOM_SELECTORS = {
  ROOT: "#root",
  PAGE_WRAPPER:
    ":is(#root > .border-subtlest.ring-subtlest.divide-subtlest.bg-base, #root > .contents)",
  SIDEBAR: {
    WRAPPER: String.raw`.group\/sidebar`,
    CHILD: {
      MENU: String.raw`.group\/sidebar-menu`,
    },
    MOBILE_TRIGGER: `.h-headerHeight.fixed.z-10 button:has(svg > use[*|href="#pplx-icon-menu-2"])`,
    PIN_SIDEBAR_BUTTON: 'button[data-testid="sidebar-pin-sidebar"]',
  },
  THREAD: {
    NAVBAR: String.raw`:is(.h-headerHeight.fixed.z-10, .h-headerHeight.\@container\/header)`,
    WRAPPER: String.raw`:is(.h-headerHeight.\@container\/header ~ div .\@container.isolate, .h-headerHeight.fixed.z-10 ~ .\@container.isolate)`,
    /** The container that wraps all messages */
    MESSAGE_BLOCKS_WRAPPER: {
      DESKTOP: {
        NORMAL: String.raw`.h-headerHeight.\@container\/header ~ div .mx-auto > .flex.flex-col:not([id])`,
        BRANCHED: String.raw`.h-headerHeight.\@container\/header ~ div .mx-auto > .flex.flex-col:not([id])`,
      },
      MOBILE: {
        NORMAL: String.raw`.h-headerHeight ~ div .mx-auto > .flex.flex-col:not([id])`,
        BRANCHED: String.raw`.h-headerHeight ~ div .mx-auto > .flex.flex-col:not([id])`,
      },
    },
    MESSAGE: {
      QUERY_WRAPPER: "[role=tabpanel] .flex.flex-col > .bg-base",
      QUERY: String.raw`.group\/query`,
      QUERY_EDIT_TEXTBOX:
        'div[contenteditable="true"][role="textbox"]:not([id])',
      QUERY_EDIT_BUTTON_GROUP: String.raw`.pointer-events-none.group-hover\:opacity-100.focus-within\:pointer-events-auto.focus-within\:opacity-100`,
      QUERY_EDIT_BUTTON_GROUP_CHILD: {
        EDIT_QUERY_BUTTON: 'button:has(use[*|href="#pplx-icon-pencil"])',
      },
      STICKY_HEADER: ".h-headerHeight.fixed.z-10",
      SOURCES: String.raw`.gap-sm.grid.grid-cols-4.md\:px-0`,
      CONTENT_WRAPPER: "[role=tabpanel] .flex.flex-col > .bg-base + div", // ref QUERY_WRAPPER ⬆️
      ANSWER: "div[id*='markdown-content-']",
      ANSWER_TEXT_CONTENT: ".prose.text-pretty",
      /** The footer of the message (share, rewrite, model name, etc.) */
      FOOTER:
        ".gap-y-sm.flex.flex-col > .flex.items-center.justify-between:has(>:nth-child(2))",
      FOOTER_GROUP: {
        FIRST: ">div:first-child",
        SECOND: ">div:last-child",
      },
      FOOTER_CHILD: {
        DISPLAY_MODEL_BUTTON: 'button:has(use[*|href="#pplx-icon-cpu"])',
        REWRITE_BUTTON: 'button:has(use[*|href="#pplx-icon-repeat"])',
        REWRITE_BUTTON_WRAPPER: 'button:has(use[*|href="#pplx-icon-repeat"])',
        COPY_BUTTON: 'button:has(use[*|href="#pplx-icon-copy"])',
        THUMBS_DOWN_BUTTON: 'button:has(use[*|href="#pplx-icon-thumb-down"])',
        THUMBS_UP_BUTTON: 'button:has(use[*|href="#pplx-icon-thumb-up"])',
        MISC_BUTTON_WRAPPER: 'div:has(>button use[*|href="#pplx-icon-dots"])',
      },
      IMAGE_GEN: {
        HEADER: "div:has(+.gap-sm.grid.grid-cols-2)",
        OPTIONS_GRID: ".gap-sm.grid.grid-cols-2",
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: String.raw`div.w-full.md\:max-w-\[90vw\]:has(>pre)`,
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
    SLOGAN: String.raw`.mb-lg.md\:absolute.text-center`,
    FOOTER: String.raw`.hidden.pb-md.md\:block>div`,
    COMET_HOME_MAIN_WRAPPER: String.raw`.grid.grid-cols-\[repeat\(auto-fill\,minmax\(160px\,1fr\)\)\].gap-3`,
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
    ATTACH_BUTTON: 'button:has(use[*|href="#pplx-icon-paperclip"])',
    SUBMIT_BUTTON:
      'button[data-testid="submit-button"], button:has(>div>div>svg>path[d="M0 12.6663C0 13.4018 0.59792 13.9997 1.33333 13.9997C2.06875 13.9997 2.66667 13.4018 2.66667 12.6663V11.333C2.66667 10.5975 2.06875 9.99967 1.33333 9.99967C0.59792 9.99967 0 10.5975 0 11.333V12.6663ZM6.66667 5.33301C7.40213 5.33301 8 5.93087 8 6.66634V17.333C8 18.0685 7.40213 18.6663 6.66667 18.6663C5.9312 18.6663 5.33333 18.0685 5.33333 17.333V6.66634C5.33333 5.93087 5.9312 5.33301 6.66667 5.33301ZM10.6667 21.333C10.6667 22.0685 11.2645 22.6663 12 22.6663C12.7355 22.6663 13.3333 22.0685 13.3333 21.333V2.66634C13.3333 1.93093 12.7355 1.33301 12 1.33301C11.2645 1.33301 10.6667 1.93093 10.6667 2.66634V21.333ZM17.3333 5.33301C18.0688 5.33301 18.6667 5.93087 18.6667 6.66634V17.333C18.6667 18.0685 18.0688 18.6663 17.3333 18.6663C16.5979 18.6663 16 18.0685 16 17.333V6.66634C16 5.93087 16.5979 5.33301 17.3333 5.33301ZM24 11.333C24 10.5975 23.4021 9.99967 22.6667 9.99967C21.9312 9.99967 21.3333 10.5975 21.3333 11.333V12.6663C21.3333 13.4018 21.9312 13.9997 22.6667 13.9997C23.4021 13.9997 24 13.4018 24 12.6663V11.333Z"]), button:has(use[*|href="#pplx-icon-git-fork"])',
    FORK_BUTTON: 'button:has(use[*|href="#pplx-icon-git-fork"])',
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
      BACK_BUTTON: String.raw`.mb-3.ml-2.flex.md\:px-2`,
    },
  },
  STICKY_NAVBAR: ".h-headerHeight.fixed.z-10",
  SICKY_NAVBAR_CHILD: {
    THREAD_TITLE_WRAPPER: String.raw`.hidden.max-w-md.grow.items-center.justify-center.gap-x-xs.text-center.md\:flex`,
    THREAD_TITLE: String.raw`.min-w-0 .cursor-pointer.transition.duration-300.hover\:opacity-70`,
    THREAD_TITLE_INPUT: 'input[placeholder="Untitled"]',
    OVERFLOW_MENU_BUTTON_WRAPPER: `div:not(:is(.invisible *)):has(>button svg > use[*|href="#pplx-icon-dots"])`,
  },
} as const satisfies DomSelectors;

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
      OVERFLOW_MENU_BUTTON_WRAPPER: "thread-overflow-menu-button-wrapper",
    },
    WRAPPER: "thread-wrapper",
    MESSAGE_BLOCKS_WRAPPER: "thread-message-blocks-wrapper",
    TOC_CONTAINER: "thread-toc-container",
    MESSAGE: {
      BLOCK: "message-block",
      QUERY: "message-block-query",
      QUERY_EDIT_TEXTBOX: "message-block-query-textbox",
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
