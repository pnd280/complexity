const DomSelectors = {
  /** Selectors for Thread page */
  THREAD: {
    /** The container that wraps all messages */
    CONTAINER: {
      /** Normal thread*/
      NORMAL:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:first-child",
      /** Branched thread */
      BRANCHED:
        ".h-full.w-full.max-w-threadWidth.px-md.md\\:px-lg > div:first-child > div:nth-child(2)",
    },
  },
  HOME: {
    SLOGAN: ".mb-lg.flex.items-center.justify-center.pb-xs.md\\:text-center",
  },
} as const;

export default DomSelectors;
