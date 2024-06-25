import { ChromeStore } from '@/types/ChromeStore';

export type PopupSetting<T> = {
  id: string;
  label: string;
  storeKey: T;
  versionRelease?: string;
  experimental?: boolean;
};

const queryBoxSelectors: PopupSetting<
  keyof ChromeStore['popupSettings']['queryBoxSelectors']
>[] = [
  {
    id: 'focus-selector',
    label: 'Web search focus',
    storeKey: 'focus',
  },
  {
    id: 'collection-selector',
    label: 'Collection',
    storeKey: 'collection',
  },
  {
    id: 'language-model-selector',
    label: 'Language Model',
    storeKey: 'languageModel',
  },
  {
    id: 'image-gen-model-selector',
    label: 'Image Generation Model',
    storeKey: 'imageGenModel',
  },
];

const qolTweaks: PopupSetting<
  keyof ChromeStore['popupSettings']['qolTweaks']
>[] = [
  {
    id: 'thread-toc',
    label: 'Thread TOC',
    storeKey: 'threadTOC',
  },
  {
    id: 'quick-query-commander',
    label: 'Inline query params invocation',
    storeKey: 'quickQueryCommander',
  },
  {
    id: 'markdown-block-enhanced-toolbar',
    label: 'Markdown block toolbar',
    storeKey: 'MarkdownBlockToolbar',
  },
  {
    id: 'thread-message-sticky-toolbar',
    label: 'Thread message sticky toolbar',
    storeKey: 'threadMessageStickyToolbar',
    experimental: true,
    versionRelease: '0.0.0.12',
  },
  {
    id: 'auto-refresh-session-timeout',
    label: 'Auto-refresh Cloudflare session timeout',
    storeKey: 'autoRefreshSessionTimeout',
    experimental: true,
    versionRelease: '0.0.0.12',
  },
  {
    id: 'block-telemetry',
    label: "Block Perplexity's telemetry data",
    storeKey: 'blockTelemetry',
    versionRelease: '0.0.0.13',
  },
];

const visualTweaks: PopupSetting<
  keyof ChromeStore['popupSettings']['visualTweaks']
>[] = [
  {
    id: 'collapse-empty-visual-columns',
    label: 'Collapse empty thread visual columns',
    storeKey: 'collapseEmptyThreadVisualColumns',
  },
];

const popupSettings = {
  queryBoxSelectors,
  qolTweaks,
  visualTweaks,
};

export default popupSettings;
