const DomSelectors = {
  /** Selectors for Thread page */
  THREAD: {
    /** The outermost container that wraps the thread container and the query box */
    WRAPPER: ".max-w-threadWidth",
    /** The container that wraps all messages */
    CONTAINER: {
      /** Normal thread*/
      NORMAL:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child",
      /** Branched thread */
      BRANCHED:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:nth-child(2)",
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
      },
      CODE_BLOCK: {
        /** The outermost container that wraps the pre & code block */
        WRAPPER: "div.w-full.max-w-\\[90vw\\]",
      },
      /** The bottom toolbar of the message (share, rewrite, model name, etc.) */
      BOTTOM_BAR: ".mt-sm.flex.items-center.justify-between",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center",
  },
  QUERY_BOX: {
    TEXTAREA: {
      MAIN: 'textarea[placeholder="Ask anything..."]',
      FOLLOW_UP: 'textarea[placeholder="Ask follow-up"]',
      COLLECTION: 'textarea[placeholder="New Thread"]',
      ARBITRARY: "textarea[placeholder]",
    },
    SUBMIT_BUTTON: 'button[aria-label="Submit"]',
    /** The floating container that wraps the query box */
    WRAPPER: ".grow.block",
    PRO_SEARCH_TOGGLE: "button#copilot-toggle",
  },
  STICKY_NAVBAR: ".sticky.left-0.right-0.top-0.z-20.border-b",
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
