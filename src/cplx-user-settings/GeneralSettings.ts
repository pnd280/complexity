import { CplxUserSettings } from "@/cplx-user-settings/types/cplx-user-settings.types";

export type PopupSetting<T> = {
  id: string;
  label: string;
  description?: string;
  settingKey?: T;
  versionRelease?: string;
  experimental?: boolean;
  onClick?: () => void;
};

export default class GeneralSettings {
  static queryBoxSelectors: PopupSetting<
    keyof CplxUserSettings["generalSettings"]["queryBoxSelectors"]
  >[] = [
    {
      id: "focus-selector",
      label: "Focus Mode",
      description: "Change focus mode (e.g. web ➡️ writing) within a thread.",
      settingKey: "focus",
    },
    {
      id: "collection-selector",
      label: "Collection",
      description:
        "Initialize a new Collection thread from the homepage and the quick ask modal. Including pause/resume the AI Profile.",
      settingKey: "collection",
    },
    {
      id: "language-model-selector",
      label: "Language Model",
      description:
        "Switch Language Models quickly, including within threads. Options include legacy models: GPT-4 Turbo, Mistral Large, and Gemini Pro 1.0.",
      settingKey: "languageModel",
    },
    {
      id: "image-gen-model-selector",
      label: "Image Generation Model",
      description:
        "Change Image Generation in the image generation modal (in a thread).",
      settingKey: "imageGenModel",
    },
  ];

  static qolTweaks: PopupSetting<
    keyof CplxUserSettings["generalSettings"]["qolTweaks"]
  >[] = [
    {
      id: "block-telemetry",
      label: "[Privacy] Block Perplexity's analytic events",
      settingKey: "blockTelemetry",
      description: "Block all traffic related to tracking user behavior.",
      versionRelease: "0.0.0.13",
    },
    {
      id: "thread-toc",
      label: "Thread Toc",
      description: "Enable a table of contents for your thread.",
      settingKey: "threadToc",
    },
    {
      id: "custom-markdown-block",
      label: "Custom markdown block",
      description:
        "Precisely display the language of your code and enable syntax highlighting for natively unsupported languages. e.g. `gdscript`, `blade`, etc.",
      settingKey: "customMarkdownBlock",
    },
    {
      id: "thread-message-sticky-toolbar",
      label: "Thread message sticky toolbar",
      settingKey: "threadMessageStickyToolbar",
      description: "Enable a sticky toolbar for your thread.",
      versionRelease: "0.0.0.12",
    },
    {
      id: "auto-refresh-session-timeout",
      label: "Auto-refresh Cloudflare session timeout",
      settingKey: "autoRefreshSessionTimeout",
      description:
        "Automatically reload the page when Cloudflare session expires.",
      versionRelease: "0.0.0.12",
    },
    {
      id: "auto-generate-thread-title",
      label: "Auto-generate thread title",
      settingKey: "autoGenerateThreadTitle",
      experimental: true,
      description: "Auto-generate a 3-10 word title for your thread.",
      versionRelease: "0.0.4.0",
    },
    {
      id: "no-file-creation-on-paste",
      label: "No file creation on long text paste",
      settingKey: "noFileCreationOnPaste",
      description: "Pasting long text no longer creates a file.",
      versionRelease: "0.0.1.0",
    },
    {
      id: "file-dropable-thread-wrapper",
      label: "Drop to upload files within thread",
      settingKey: "fileDropableThreadWrapper",
      description: "Treat the whole page as a dropzone for file uploads.",
      versionRelease: "0.0.1.0",
    },
  ];

  static visualTweaks: PopupSetting<
    keyof CplxUserSettings["generalSettings"]["visualTweaks"]
  >[] = [
    {
      id: "collapse-empty-visual-columns",
      label: "Collapse empty thread visual columns.",
      description:
        "Hide the blank part of the message column when there is no media.",
      settingKey: "collapseEmptyThreadVisualColumns",
    },
    {
      id: "custom-theme",
      label:
        "Custome theme: provide your own custom CSS, accent color, fonts, etc.",
    },
  ];
}
