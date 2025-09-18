import { z } from "zod";

export const DomSelectorsSchema = z.object({
  PAGE_WRAPPER: z.string(),
  PAGE_CHILD_WRAPPER: z.string(),
  SIDEBAR: z.object({
    WRAPPER: z.string(),
    CHILD: z.object({
      MENU: z.string(),
    }),
    MOBILE_TRIGGER: z.string(),
  }),
  THREAD: z.object({
    NAVBAR: z.string(),
    PAGE_WRAPPER: z.string(),
    WRAPPER: z.string(),
    MESSAGE_BLOCKS_WRAPPER: z.object({
      DESKTOP: z.object({
        NORMAL: z.string(),
        BRANCHED: z.string(),
      }),
      MOBILE: z.object({
        NORMAL: z.string(),
        BRANCHED: z.string(),
      }),
    }),
    MESSAGE: z.object({
      QUERY_WRAPPER: z.string(),
      QUERY: z.string(),
      QUERY_EDIT_BUTTON_GROUP: z.string(),
      QUERY_EDIT_BUTTON_GROUP_CHILD: z.object({
        EDIT_QUERY_BUTTON: z.string(),
      }),
      STICKY_HEADER: z.string(),
      SOURCES: z.string(),
      ANSWER: z.string(),
      ANSWER_TEXT_CONTENT: z.string(),
      FOOTER: z.string(),
      FOOTER_CHILD: z.object({
        REWRITE_BUTTON: z.string(),
        COPY_BUTTON: z.string(),
        THUMBS_DOWN_BUTTON: z.string(),
        MISC_BUTTON: z.string(),
      }),
      IMAGE_GEN: z.object({
        HEADER: z.string(),
        OPTIONS_GRID: z.string(),
      }),
      CODE_BLOCK: z.object({
        WRAPPER: z.string(),
        NATIVE_HEADER: z.string(),
        NATIVE_COPY_BUTTON: z.string(),
        LANGUAGE_INDICATOR: z.string(),
      }),
    }),
    POPPER: z.object({
      DESKTOP: z.string(),
    }),
  }),
  HOME: z.object({
    SLOGAN: z.string(),
    FOOTER: z.string(),
    COMET_HOME_MAIN_WRAPPER: z.string(),
  }),
  QUERY_BOX: z.object({
    WRAPPER: z.object({
      MAIN: z.string(),
      SPACE: z.string(),
      FOLLOW_UP: z.string(),
      COMET_ASSISTANT: z.string(),
      ARBITRARY: z.string(),
    }),
    ATTR_WRAPPER: z.string(),
    ATTR_WRAPPER_CHILD: z.object({
      LEFT_ATTR_WRAPPER: z.string(),
      RIGHT_ATTR_WRAPPER: z.string(),
    }),
    TEXTBOX: z.object({
      MAIN: z.string(),
      SPACE: z.string(),
      FOLLOW_UP: z.string(),
      COMET_ASSISTANT: z.string(),
      EDIT_QUERY: z.string(),
      ARBITRARY: z.string(),
    }),
    ATTACH_BUTTON: z.string(),
    SUBMIT_BUTTON: z.string(),
    FORK_BUTTON: z.string(),
    PRO_SEARCH_TOGGLE: z.string(),
    INCOGNITO_TOGGLE: z.string(),
    TYPEAHEAD_MENU: z.string(),
    CONTENT_EDITABLE: z.object({
      TEXTCONTENT_NODE: z.string(),
    }),
    SEARCH_TYPE_RADIO: z.object({
      ITEM: z.string(),
      CHECKED_ITEM: z.string(),
    }),
  }),
  SETTINGS_PAGE: z.object({
    SIDEBAR_WRAPPER: z.string(),
    SIDEBAR_CHILD: z.object({
      BACK_BUTTON: z.string(),
    }),
  }),
  STICKY_NAVBAR: z.string(),
  SICKY_NAVBAR_CHILD: z.object({
    THREAD_TITLE_WRAPPER: z.string(),
    THREAD_TITLE: z.string(),
    THREAD_TITLE_INPUT: z.string(),
    OVERFLOW_MENU_BUTTON_WRAPPER: z.string(),
  }),
});

export type DomSelectors = z.infer<typeof DomSelectorsSchema>;
