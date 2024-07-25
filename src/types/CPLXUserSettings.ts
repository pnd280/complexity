import * as z from "zod";

import {
  WebAccessFocus,
  webAccessFocus,
} from "@/content-script/components/QueryBox";
import Canvas, { CanvasLang } from "@/utils/Canvas";

import packageData from '../../package.json';

import { NestedKeys } from "./Utils";


type WebAccessFocusCode = WebAccessFocus["code"];

const WebAccessFocusSchema = z.custom<WebAccessFocusCode>((val) => {
  return webAccessFocus.some((item) => item.code === val);
});

const CanvasLangSchema = z.custom<CanvasLang>((val) => {
  return Canvas.isCanvasLang(val);
});

export const CPLXUserSettingsSchema = z.object({
  schemaVersion: z.literal(packageData.version),
  defaultFocus: WebAccessFocusSchema.nullable(),
  defaultWebAccess: z.boolean(),
  secretMode: z.boolean(),
  popupSettings: z.object({
    queryBoxSelectors: z.object({
      focus: z.boolean(),
      languageModel: z.boolean(),
      imageGenModel: z.boolean(),
      collection: z.boolean(),
    }),
    qolTweaks: z.object({
      threadTOC: z.boolean(),
      threadMessageStickyToolbar: z.boolean(),
      alternateMarkdownBlock: z.boolean(),
      canvas: z.object({
        enabled: z.boolean(),
        mask: z.record(CanvasLangSchema, z.boolean()),
      }),
      autoRefreshSessionTimeout: z.boolean(),
      blockTelemetry: z.boolean(),
      noFileCreationOnPaste: z.boolean(),
      fileDropableThreadWrapper: z.boolean(),
    }),
    visualTweaks: z.object({
      collapseEmptyThreadVisualColumns: z.boolean(),
    }),
  }),
  customTheme: z.object({
    slogan: z.string().optional(),
    uiFont: z.string().optional(),
    monoFont: z.string().optional(),
    accentColor: z.string().optional(),
    customCSS: z.string().optional(),
  }),
});

export type CPLXUserSettings = z.infer<typeof CPLXUserSettingsSchema>;

export type PopupSettingKeys = NestedKeys<CPLXUserSettings["popupSettings"]>;
