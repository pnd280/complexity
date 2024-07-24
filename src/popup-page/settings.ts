import { CPLXUserSettings } from "@/types/CPLXUserSettings";
import background from "@/utils/background";

export type PopupSetting<T> = {
  id: string;
  label: string;
  storeKey?: T;
  versionRelease?: string;
  experimental?: boolean;
  onClick?: () => void;
};

const queryBoxSelectors: PopupSetting<
  keyof CPLXUserSettings["popupSettings"]["queryBoxSelectors"]
>[] = [
  {
    id: "focus-selector",
    label: "Web search focus",
    storeKey: "focus",
  },
  {
    id: "collection-selector",
    label: "Collection",
    storeKey: "collection",
  },
  {
    id: "language-model-selector",
    label: "Language Model",
    storeKey: "languageModel",
  },
  {
    id: "image-gen-model-selector",
    label: "Image Generation Model",
    storeKey: "imageGenModel",
  },
];

const qolTweaks: PopupSetting<
  keyof CPLXUserSettings["popupSettings"]["qolTweaks"]
>[] = [
  {
    id: "thread-toc",
    label: "Thread TOC",
    storeKey: "threadTOC",
  },
  {
    id: "alternate-markdown-block",
    label: "Alternate markdown block",
    storeKey: "alternateMarkdownBlock",
  },
  {
    id: "thread-message-sticky-toolbar",
    label: "Thread message sticky toolbar",
    storeKey: "threadMessageStickyToolbar",
    versionRelease: "0.0.0.12",
  },
  {
    id: "auto-refresh-session-timeout",
    label: "Auto-refresh Cloudflare session timeout",
    storeKey: "autoRefreshSessionTimeout",
    versionRelease: "0.0.0.12",
  },
  {
    id: "block-telemetry",
    label: "Block Perplexity's telemetry data",
    storeKey: "blockTelemetry",
    versionRelease: "0.0.0.13",
  },
];

const visualTweaks: PopupSetting<
  keyof CPLXUserSettings["popupSettings"]["visualTweaks"]
>[] = [
  {
    id: "collapse-empty-visual-columns",
    label: "Collapse empty thread visual columns",
    storeKey: "collapseEmptyThreadVisualColumns",
  },
  {
    id: "custom-theme",
    label: "Custom Css, accent color, fonts, etc.",
    onClick: () => {
      background.sendMessage({
        action: "openCustomTheme",
      });
    },
  },
];

const popupSettings = {
  queryBoxSelectors,
  qolTweaks,
  visualTweaks,
};

export default popupSettings;
