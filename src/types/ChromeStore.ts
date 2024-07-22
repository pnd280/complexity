import { CanvasLang } from "@/utils/Canvas";

import { WebAccessFocus } from "./ModelSelector";
import { Nullable } from "./Utils";

export type ChromeStoreKey = keyof ChromeStore;

export type A = ChromeStore["popupSettings"]["qolTweaks"]["canvas"];

export type ChromeStore = {
  defaultFocus: Nullable<WebAccessFocus["code"]>;
  defaultWebAccess: boolean;
  secretMode: boolean;
  popupSettings: {
    queryBoxSelectors: {
      focus: boolean;
      languageModel: boolean;
      imageGenModel: boolean;
      collection: boolean;
    };
    qolTweaks: {
      threadTOC: boolean;
      quickQueryCommander: boolean;
      threadMessageStickyToolbar: boolean;
      alternateMarkdownBlock: boolean;
      canvas: {
        enabled: boolean;
        mask: Partial<Record<CanvasLang, boolean>>;
      };
      autoRefreshSessionTimeout: boolean;
      blockTelemetry: boolean;
    };
    visualTweaks: {
      collapseEmptyThreadVisualColumns: boolean;
    };
  };
  customTheme: {
    slogan?: string;
    uiFont?: string;
    monoFont?: string;
    accentColor?: string;
    customCSS?: string;
  };
};

type NestedKeys<T> = {
  [K in keyof T]: T[K] extends object ? keyof T[K] : never;
}[keyof T];

export type PopupSettingKeys = NestedKeys<ChromeStore["popupSettings"]>;
