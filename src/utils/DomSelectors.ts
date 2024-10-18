const DomSelectors = {
  /** Selectors for Thread page */
  THREAD: {
    /** The outermost container that wraps the thread container and the query box */
    WRAPPER: ".max-w-threadWidth",
    /** The container that wraps all messages */
    CONTAINER: {
      /** Normal thread*/
      NORMAL:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div.relative > div:first-child",
      /** Branched thread */
      BRANCHED:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg div.relative > div:nth-child(2):not([class])",
    },
    MESSAGE: {
      TEXT_COL: ".col-span-8",
      /** Columns that contain images, videos, image gen popover */
      VISUAL_COL: ".col-span-4",
      TEXT_COL_CHILD: {
        /** The query box */
        QUERY: ".my-md.md\\:my-lg",
        /** The answer box */
        ANSWER: ".relative.default.font-sans.text-base",
        /** The answer heading */
        ANSWER_HEADING:
          '.mb-sm.flex.w-full.items-center.justify-between:contains("Answer")',
        SOURCE_HEADING:
          '.mb-sm.flex.w-full.items-center.justify-between:contains("Sources")',
      },
      VISUAL_COL_CHILD: {
        IMAGE_GEN_POPOVER:
          "div.grid.grid-cols-2.gap-sm.border-borderMain\\/50.ring-borderMain\\/50.divide-borderMain\\/50.dark\\:divide-borderMainDark\\/50.dark\\:ring-borderMainDark\\/50.dark\\:border-borderMainDark\\/50.bg-transparent",
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: "div.w-full.max-w-\\[90vw\\]",
      },
      /** The bottom toolbar of the message (share, rewrite, model name, etc.) */
      BOTTOM_BAR: ".mt-sm.flex.items-center.justify-between",
      BOTTOM_BAR_CHILD: {
        MISC_BUTTON: 'button:has([data-icon="ellipsis"])',
        REWRITE_BUTTON: 'button:contains("Rewrite")',
      },
    },
    POPPER: {
      MOBILE: ".duration-250.fill-mode-both.fixed.bottom-0.left-0",
      DESKTOP: "[data-popper-reference-hidden='true']",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.md\\:text-center.pb-xs.md\\:text-center",
  },
  QUERY_BOX: {
    TEXTAREA: {
      MAIN: '[data-testid="quick-search-modal"] textarea[placeholder][autocomplete][style*="height: 48px !important;"], .max-w-screen-md textarea[placeholder][autocomplete][style*="height: 48px !important;"]',
      FOLLOW_UP:
        '[location="thread"] textarea[placeholder][autocomplete][style*="height: 48px !important;"]',
      SPACE:
        '[location="space"] textarea[placeholder][autocomplete][style*="height: 48px !important;"]',
      ARBITRARY:
        'textarea[placeholder][autocomplete][style*="height: 48px !important;"]',
    },
    SUBMIT_BUTTON: 'button[aria-label="Submit"]',
    FORK_BUTTON: 'button svg[data-icon="code-fork"]',
    /** The floating container that wraps the query box */
    WRAPPER: ".grow.block",
    PRO_SEARCH_TOGGLE: "button#copilot-toggle",
  },
  STICKY_NAVBAR: ".sticky.left-0.right-0.top-0.border-b",
  SICKY_NAVBAR_CHILD: {
    THREAD_TITLE_WRAPPER:
      ".hidden.max-w-md.grow.items-center.justify-center.gap-x-xs.text-center.md\\:flex",
    THREAD_TITLE:
      ".min-w-0 .cursor-pointer.transition.duration-300.hover\\:opacity-70",
    THREAD_TITLE_INPUT: 'input[placeholder="Untitled"]',
  },
} as const;

const DomHelperSelectors = {
  THREAD: {
    MESSAGE: {
      BLOCK: ".message-block",
      TEXT_COL: ".text-col",
      VISUAL_COL: ".visual-col",
      TEXT_COL_CHILD: {
        MARKDOWN_QUERY: ".markdown-query-wrapper",
      },
    },
  },
};

export { DomSelectors, DomHelperSelectors };
