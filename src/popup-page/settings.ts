import { CPLXUserSettings } from "@/types/CPLXUserSettings";
import background from "@/utils/background";

export type PopupSetting<T> = {
  id: string;
  label: string;
  settingKey?: T;
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
    settingKey: "focus",
  },
  {
    id: "collection-selector",
    label: "Collection",
    settingKey: "collection",
  },
  {
    id: "language-model-selector",
    label: "Language Model",
    settingKey: "languageModel",
  },
  {
    id: "image-gen-model-selector",
    label: "Image Generation Model",
    settingKey: "imageGenModel",
  },
];

const qolTweaks: PopupSetting<
  keyof CPLXUserSettings["popupSettings"]["qolTweaks"]
>[] = [
  {
    id: "thread-toc",
    label: "Thread TOC",
    settingKey: "threadTOC",
  },
  {
    id: "alternate-markdown-block",
    label: "Alternate markdown block",
    settingKey: "alternateMarkdownBlock",
  },
  {
    id: "thread-message-sticky-toolbar",
    label: "Thread message sticky toolbar",
    settingKey: "threadMessageStickyToolbar",
    versionRelease: "0.0.0.12",
  },
  {
    id: "auto-refresh-session-timeout",
    label: "Auto-refresh Cloudflare session timeout",
    settingKey: "autoRefreshSessionTimeout",
    versionRelease: "0.0.0.12",
  },
  {
    id: "block-telemetry",
    label: "Block Perplexity's telemetry data",
    settingKey: "blockTelemetry",
    versionRelease: "0.0.0.13",
  },
  {
    id: "no-file-creation-on-paste",
    label: "No file creation on long text paste",
    settingKey: "noFileCreationOnPaste",
    versionRelease: "0.0.1.0",
  },
  {
    id: "file-dropable-thread-wrapper",
    label: "Drop file within thread",
    settingKey: "fileDropableThreadWrapper",
    versionRelease: "0.0.1.0",
  },
];

const visualTweaks: PopupSetting<
  keyof CPLXUserSettings["popupSettings"]["visualTweaks"]
>[] = [
  {
    id: "collapse-empty-visual-columns",
    label: "Collapse empty thread visual columns",
    settingKey: "collapseEmptyThreadVisualColumns",
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
