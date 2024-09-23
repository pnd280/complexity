import * as z from "zod";

import { FocusMode } from "@/content-script/components/QueryBox";
import { focusModes } from "@/content-script/components/QueryBox/consts";
import Canvas, { CanvasLang } from "@/utils/Canvas";
import packageData from "~/package.json";

type WebAccessFocusCode = FocusMode["code"];

const WebAccessFocusSchema = z.custom<WebAccessFocusCode>((val) => {
  return focusModes.some((item) => item.code === val);
});

const CanvasLangSchema = z.custom<CanvasLang>((val) => {
  return Canvas.isCanvasLang(val);
});

export const cplxUserSettingsSchema = z.object({
  schemaVersion: z.literal(packageData.version),
  isFirstVisit: z.boolean(),
  defaultFocusMode: WebAccessFocusSchema.nullable(),
  defaultProSearchState: z.boolean(),
  generalSettings: z.object({
    queryBoxSelectors: z.object({
      focus: z.boolean(),
      languageModel: z.boolean(),
      imageGenModel: z.boolean(),
      collection: z.boolean(),
    }),
    qolTweaks: z.object({
      threadToc: z.boolean(),
      threadMessageStickyToolbar: z.boolean(),
      customMarkdownBlock: z.boolean(),
      canvas: z.object({
        enabled: z.boolean(),
        mask: z.record(CanvasLangSchema, z.boolean()),
      }),
      autoRefreshSessionTimeout: z.boolean(),
      blockTelemetry: z.boolean(),
      noFileCreationOnPaste: z.boolean(),
      fileDropableThreadWrapper: z.boolean(),
      autoGenerateThreadTitle: z.boolean(),
      trackProSearchState: z.boolean(),
    }),
    visualTweaks: z.object({
      collapseEmptyThreadVisualColumns: z.boolean(),
    }),
  }),
  customTheme: z.object({
    uiFont: z.string().optional(),
    monoFont: z.string().optional(),
    accentColor: z.string().optional(),
    customCSS: z.string().optional(),
  }),
});

export type CplxUserSettings = z.infer<typeof cplxUserSettingsSchema>;

type SubKey<T> = {
  [K in keyof T]: T[K] extends object ? keyof T[K] : never;
}[keyof T];

export type GeneralSettingsKeys = SubKey<CplxUserSettings["generalSettings"]>;
