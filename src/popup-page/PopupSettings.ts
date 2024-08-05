import { CplxUserSettings } from "@/types/cplx-user-settings.types";
import BackgroundScript from "@/utils/BackgroundScript";

export type PopupSetting<T> = {
  id: string;
  label: string;
  settingKey?: T;
  versionRelease?: string;
  experimental?: boolean;
  onClick?: () => void;
};

export default class PopupSettings {
  static queryBoxSelectors: PopupSetting<
    keyof CplxUserSettings["popupSettings"]["queryBoxSelectors"]
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

  static qolTweaks: PopupSetting<
    keyof CplxUserSettings["popupSettings"]["qolTweaks"]
  >[] = [
    {
      id: "block-telemetry",
      label: "Enhance privacy",
      settingKey: "blockTelemetry",
      versionRelease: "0.0.0.13",
    },
    {
      id: "thread-toc",
      label: "Thread Toc",
      settingKey: "threadToc",
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
      id: "no-file-creation-on-paste",
      label: "No file creation on long text paste",
      settingKey: "noFileCreationOnPaste",
      versionRelease: "0.0.1.0",
    },
    {
      id: "file-dropable-thread-wrapper",
      label: "Drop to upload files within thread",
      settingKey: "fileDropableThreadWrapper",
      versionRelease: "0.0.1.0",
    },
  ];

  static visualTweaks: PopupSetting<
    keyof CplxUserSettings["popupSettings"]["visualTweaks"]
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
        BackgroundScript.sendMessage({
          action: "openCustomTheme",
        });
      },
    },
  ];
}
